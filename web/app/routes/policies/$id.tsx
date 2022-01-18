import { useState } from "react";
import { useLoaderData, LoaderFunction } from "remix";
import SearchBox from "~/components/search-box";
import { TokenCard } from "~/components/token-card";
import { TokenModal } from "~/components/token-modal";
import { fetchByTerm, OuraRecord } from "~/fetching";

interface Load {
    policyId: string,
    results: OuraRecord[],
}

export const loader: LoaderFunction = async ({ params }): Promise<Load | null> => {
    const policyId = params.id;
    if (!policyId) return null;

    // TODO: use custom fetch for policies
    const results = await fetchByTerm({ term: policyId });
    return { policyId, results };
}

export default function Policy() {
    const load = useLoaderData<Load | null>();

    const [selected, setSelected] = useState<OuraRecord>();

    return (
        <>
            <div className="w-full p-5 xl:p-12">
                <TokenModal open={!!selected} dto={selected} onClose={() => setSelected(undefined)} />
                <div className="header flex items-center justify-between mb-12">
                    <div className="title">
                        <p className="text-4xl font-bold text-gray-800 mb-4">
                            Policy Assets
                        </p>
                        <p className="text-2xl font-light text-gray-400">
                            List of CIP-25 assets linked to the policy <span className="bg-gray-100 rounded-md px-4 py-2">{load?.policyId}</span>
                        </p>
                    </div>
                    <SearchBox />
                </div>
                {!load && <div>Please specify a valid policy id</div>}
                
                {!load?.results.length && <div>No assets found for the specified policy</div>}

                {!!load?.results.length &&
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16">
                        {load.results.map(dto => <TokenCard key={dto.cip25_asset.policy + dto.cip25_asset.asset} dto={dto} onSelect={setSelected} />)}
                    </div>
                }
            </div>
        </>
    )
}