import { LoaderFunction, useLoaderData } from "remix";
import { OuraRecord, fetchByTerm } from "../../fetching";
import { useState } from "react";

import AssetCard from "~/components/asset-card"
import AssetModal from "~/components/asset-modal";
import SearchBox from "~/components/search-box";

interface Load {
    term: string | null,
    results: OuraRecord[],
}

export const loader: LoaderFunction = async ({ request }): Promise<Load | null> => {
    const url = new URL(request.url);
    const term = url.searchParams.get("term");
    if (!term) return null;

    const results = await fetchByTerm({ term });
    return { term, results };
};

export default function () {
    const load = useLoaderData<Load | null>();

    const [selected, setSelected] = useState<OuraRecord>();

    return (
        <>
            <div className="w-full p-5 xl:p-12">
                <AssetModal open={!!selected} dto={selected} onClose={() => setSelected(undefined)} />
                <div className="header flex items-center justify-between mb-12">
                    <div className="title">
                        <p className="text-4xl font-bold text-gray-800 mb-4">
                            Search by Term
                        </p>
                        <p className="text-2xl font-light text-gray-400">
                            List of CIP-25 assets matching the specified term <span className="bg-gray-100 rounded-md px-4 py-2">{load?.term}</span>
                        </p>
                    </div>
                </div>

                {!load && <div>Please specify a valid search term</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16">
                    {!!load?.results.length && load.results.map(dto => <AssetCard key={dto.cip25_asset.policy + dto.cip25_asset.asset} dto={dto} onSelect={setSelected} />)}
                </div>
            </div>
        </>
    )
}
