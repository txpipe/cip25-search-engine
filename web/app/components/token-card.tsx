import { useCallback } from "react";
import { OuraRecord } from "~/fetching";

const FALLBACK_IMAGE = "https://something";

function rawIpfsUriToBrowserUrl(raw?: string | null): string {
    if (!raw) return FALLBACK_IMAGE;
    // not nice, but works. Don't judge me.
    raw = raw.replace("ipfs://", "");
    raw = raw.replace("ipfs/", "");
    return `https://ipfs.io/ipfs/${raw}`;
}

export function TokenCard(props: { dto: OuraRecord, onSelect: (dto: OuraRecord) => void }) {
    const { dto } = props;

    const onSelect = useCallback(() => {
        props.onSelect(dto);
    }, [dto]);

    return (
        <div className="overflow-hidden shadow-lg rounded-lg h-90 w-full cursor-pointer m-auto">
            <a href="#" className="w-full block h-full" onClick={onSelect}>
                <img alt={dto.cip25_asset.asset} src={rawIpfsUriToBrowserUrl(dto.cip25_asset.image)} className="max-h-60 w-full object-cover" />
                <div className="bg-white w-full p-4">
                    <p className="text-indigo-500 font-strong text-lg">
                        {dto.cip25_asset.name}
                    </p>
                    <p className="text-gray-400 font-light text-xs">policy:</p>
                    <p className="text-gray-500 font-light text-md text-ellipsis overflow-hidden w-full">
                        {dto.cip25_asset.policy}
                    </p>
                    <p className="text-gray-400 font-light text-xs">description:</p>
                    <p className="text-gray-500 font-light text-md text-allipsis overflow-hidden">
                        {dto.cip25_asset.description}
                    </p>
                    <div className="flex items-center mt-4">
                        
                    </div>
                </div>
            </a>
        </div>
    )
}
