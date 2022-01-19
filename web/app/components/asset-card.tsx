import classNames from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import { OuraRecord } from "~/fetching";
import { computeAssetStats, rawIpfsUriToBrowserUrl } from "~/parsing";
import { LazyMount } from "~/utils";

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

function AssetStats(props: { dto: OuraRecord }) {
    const stats = useMemo(
        () => computeAssetStats(props.dto),
        [props.dto],
    );

    return <>
        <span className="bg-gray-100 mr-1 text-gray-400 rounded-xl px-4 py-1 text-xs">props: {stats.propertyCount}</span>
        <span className="bg-gray-100 mr-1 text-gray-400 rounded-xl px-4 py-1 text-xs">files: {stats.fileCount}</span>
    </>
}

export default function AssetCard(props: { dto: OuraRecord, onSelect?: (dto: OuraRecord) => void }) {
    const { dto } = props;

    const onSelect = useCallback(() => {
        if (!props.onSelect) return;
        props.onSelect(dto);
    }, [dto]);

    return (
        <div className="overflow-hidden shadow-lg rounded-lg h-90 w-full cursor-pointer m-auto">
            <div className="w-full block h-full cursor-pointer" onClick={onSelect}>
                <div className="h-60 w-full">
                    <LazyMount fallback={null} className="w-full h-full">
                        <LoadableImage dto={props.dto} />
                    </LazyMount>
                </div>
                <div className="bg-white w-full p-4">
                    <p className="text-gray-400 font-light text-xs text-ellipsis overflow-hidden w-full">
                        policy:&nbsp;{dto.cip25_asset.policy}
                    </p>
                    <p className="text-indigo-500 font-strong text-lg">
                        {dto.cip25_asset.name}
                    </p>
                    <p className="text-gray-500 font-light text-md text-allipsis overflow-hidden">
                        {dto.cip25_asset.description}
                    </p>
                    <div className="flex items-center mt-4">
                        <LazyMount>
                            <AssetStats dto={dto} />
                        </LazyMount>
                    </div>
                </div>
            </div>
        </div>
    )
}
