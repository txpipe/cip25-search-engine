import { OuraRecord } from "./fetching";

export enum PropertyStereotype {
    Artist = "artist",
    AssetType = "assetType",
    Collection = "collection",
    Name = "name",
    Publisher = "publisher",
    Summary = "summary",
    Discord = "discord",
    Twitter = "twitter",
    Website = "website",
    Copyright = "copyright",
    Description = "description",
}

export type AssetProperty = {
    propertyKey: string,
    stringValue: string | undefined,
    stereotype: PropertyStereotype | undefined,
    ancestors: string[] | undefined,
}

const WellKnownProperty = ["files", "mediaType", "name", "image", "description"];

function unkownAttributeValueToString(x: unknown): string | undefined {
    switch (typeof x) {
        case "string":
            return x;
        case "number":
            return x.toString();
        case "object":
            if (Array.isArray(x)) {
                return JSON.stringify(x);
            }
    }

    return undefined;
}

function jsonEntryToProperty(propertyKey: string, rawValue: any, ancestors?: string[]): AssetProperty {
    const stereotype = Object.values(PropertyStereotype).find(stereotype => propertyKey.toLowerCase() === stereotype);

    const stringValue = unkownAttributeValueToString(rawValue);

    return {
        propertyKey,
        stringValue,
        stereotype,
        ancestors,
    };
}

export function* yieldAssetProperties(asset: Object, ancestors: string[]): IterableIterator<AssetProperty> {
    if (!asset) return;

    // if we got to deep in the recursion, just stop
    if (ancestors.length > 4) return;

    for (const [propertyKey, rawValue] of Object.entries(asset)) {
        // Don't return well-knwon types, those are already shown in the UI
        if (WellKnownProperty.includes(propertyKey)) {
            continue;
        }

        switch (typeof rawValue) {
            case "object":
                const newAncestors = [...ancestors, propertyKey];
                yield* yieldAssetProperties(rawValue, newAncestors);
                break;
                
            case "number":
            case "string":
            case "boolean":
                yield jsonEntryToProperty(propertyKey, rawValue, ancestors);
                break;
        }
    }
}

export interface AssetFile {
    mediaType?: string,
    name?: string,
    src: string,
}

function isFileRecord(source: any): source is AssetFile {
    return !!source?.src;
}

export function* yieldAssetFiles(asset: any): IterableIterator<AssetFile> {
    const files = asset["files"];
    if (!files?.length) return;

    for (const obj of files) {
        if (isFileRecord(obj)) {
            yield obj;
        }
    }
}

export function findLastTimestamp(assets: OuraRecord[]): number | undefined {
    if (!assets.length) return undefined;
    const last = assets[assets.length - 1];
    return last["@timestamp"];
}

export type AssetStats = {
    propertyCount: number,
    fileCount: number,
}

export function computeAssetStats(record: OuraRecord): AssetStats {
    return {
        fileCount: Array.from(yieldAssetFiles(record.cip25_asset.raw_json)).length,
        propertyCount: Array.from(yieldAssetProperties(record.cip25_asset.raw_json, [])).length,
    };
}

// TODO
const FALLBACK_IMAGE = "";

// TODO: allow change via config
// IDEA: use round-robbing over multiple to paralelize browser requests
// const IPFS_GATEWAY = "https://cf-ipfs.com";
// const IPFS_GATEWAY = "https://ipfs.io";
const IPFS_GATEWAY = "https://gateway.ipfs.io";

export function rawIpfsUriToBrowserUrl(raw?: string | null): string {
    if (!raw) return FALLBACK_IMAGE;
    // not nice, but works. Don't judge me.
    raw = raw.replace("ipfs://", "");
    raw = raw.replace("ipfs/", "");
    return `${IPFS_GATEWAY}/ipfs/${raw}`;
}
