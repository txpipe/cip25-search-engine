import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { OuraRecord } from "~/fetching";
import { LazyMount } from "~/utils";

const FALLBACK_IMAGE = "https://something";

function rawIpfsUriToBrowserUrl(raw?: string | null): string {
    if (!raw) return FALLBACK_IMAGE;
    // not nice, but works. Don't judge me.
    raw = raw.replace("ipfs://", "");
    raw = raw.replace("ipfs/", "");
    return `https://ipfs.io/ipfs/${raw}`;
}

function LoadableImage(props: { dto: OuraRecord }) {
    const [loaded, setLoaded] = useState<boolean>(false);

    const url = useMemo(() => {
        return rawIpfsUriToBrowserUrl(props.dto.cip25_asset.image);
    }, [props.dto]);

    const onLoad = useCallback(() => {
        setLoaded(true);
    }, []);

    const classes = classNames("w-full", "h-full", "object-cover", { "invisible": !loaded });

    return (
        <>
            {!loaded && <div className="w-full h-full bg-gray-300 animate-pulse flex items-center justify-center">
                <span className="text-gray-400 text-lg">loading...</span>
            </div>}
            <img
                alt={props.dto.cip25_asset.asset}
                src={url}
                className={classes}
                onLoad={onLoad}
            />
        </>
    );
}

export default function AssetCard(props: { dto: OuraRecord, onSelect?: (dto: OuraRecord) => void }) {
    const { dto } = props;

    const onSelect = useCallback(() => {
        if (!props.onSelect) return;
        props.onSelect(dto);
    }, [dto]);

    return (
        <div className="overflow-hidden shadow-lg rounded-lg h-90 w-full cursor-pointer m-auto">
            <a href="#" className="w-full block h-full" onClick={onSelect}>
                <div className="h-60 w-full">
                    <LazyMount fallback={null} className="w-full h-full">
                        <LoadableImage dto={props.dto} />
                    </LazyMount>
                </div>
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
            </a >
        </div >
    )
}
