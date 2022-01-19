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
}

const WellKnownProperty = ["files", "mediaType", "name", "image", "description"];

function unkownAttributeValueToString(x: unknown): string | undefined {
    switch (typeof x) {
        case "string":
            return x;
        case "number":
            return x.toString();
        case "object":
            if (x instanceof Array) {
                const first = x[0];
                return unkownAttributeValueToString(first);
            }
    }

    return undefined;
}

function jsonEntryToProperty(propertyKey: string, rawValue: any): AssetProperty {
    const stereotype = Object.values(PropertyStereotype).find(stereotype => propertyKey.toLowerCase() === stereotype);

    const stringValue = unkownAttributeValueToString(rawValue);

    return {
        propertyKey,
        stringValue,
        stereotype,
    };
}

export function* yieldAssetProperties(asset: Object): IterableIterator<AssetProperty> {
    for (const [propertyKey, rawValue] of Object.entries(asset)) {
        // Don't return well-knwon types, those are already shown in the UI
        if (WellKnownProperty.includes(propertyKey)) {
            continue;
        }

        switch (typeof rawValue) {
            case "object":
                yield* yieldAssetProperties(rawValue);
            case "number":
            case "string":
            case "boolean":
                yield jsonEntryToProperty(propertyKey, rawValue);
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
        propertyCount: Array.from(yieldAssetProperties(record.cip25_asset.raw_json)).length,
    };
}

// TODO
const FALLBACK_IMAGE = "";

export function rawIpfsUriToBrowserUrl(raw?: string | null): string {
    if (!raw) return FALLBACK_IMAGE;
    // not nice, but works. Don't judge me.
    raw = raw.replace("ipfs://", "");
    raw = raw.replace("ipfs/", "");
    return `https://ipfs.io/ipfs/${raw}`;
}
