import { LoaderFunction, useLoaderData } from "remix";
import { OuraRecord, fetchByTerm } from "../../fetching";
import { useState } from "react";

import AssetCard from "~/components/asset-card"
import AssetModal from "~/components/asset-modal";
import SearchBox from "~/components/search-box";

export const loader: LoaderFunction = async (): Promise<OuraRecord[]> => {
    // TODO: use custom fetch for shuffled results
    return await fetchByTerm({ term: null });
};

export default function () {
    const records = useLoaderData<OuraRecord[]>();

    const [selected, setSelected] = useState<OuraRecord>();

    return (
        <>
            <div className="w-full p-5 xl:p-12">
                <AssetModal open={!!selected} dto={selected} onClose={() => setSelected(undefined)} />
                <div className="header flex items-center justify-between mb-12">
                    <div className="title">
                        <p className="text-4xl font-bold text-gray-800 mb-4">
                            Token Shuffle
                        </p>
                        <p className="text-2xl font-light text-gray-400">
                            Random list of CIP-25 assets available in Cardano mainnet
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16">
                    {records.map(dto => <AssetCard key={dto.cip25_asset.policy + dto.cip25_asset.asset} dto={dto} onSelect={setSelected} />)}
                </div>
            </div>
        </>
    )
}
