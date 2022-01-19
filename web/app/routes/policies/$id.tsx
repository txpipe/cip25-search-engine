import { useState } from "react";
import { useLoaderData, LoaderFunction } from "remix";
import AssetCard from "~/components/asset-card";
import AssetModal from "~/components/asset-modal";
import { fetchByTerm, OuraRecord, OuraRecordPage } from "~/fetching";
import { NiceSubmitButton } from "~/components/buttons";
import { findLastTimestamp } from "~/parsing";

interface Load extends OuraRecordPage {
    policyId: string,
    nextToken?: number,
}

export const loader: LoaderFunction = async ({ params, request }): Promise<Load | null> => {
    const policyId = params.id;
    if (!policyId) return null;

    const url = new URL(request.url);
    const after = Number(url.searchParams.get("after"));

    // TODO: use custom fetch for policies
    const page = await fetchByTerm({ term: policyId, after });
    const nextToken = findLastTimestamp(page.items);

    return { ...page, policyId, nextToken };
}

export default function Policy() {
    const load = useLoaderData<Load | null>();

    const [selected, setSelected] = useState<OuraRecord>();

    return (
        <div className="w-full p-5 xl:p-12">
            <AssetModal open={!!selected} dto={selected} onClose={() => setSelected(undefined)} />
            <div className="header flex items-center justify-between mb-12">
                <div className="title">
                    <p className="text-4xl font-bold text-gray-800 mb-4">
                        All Assets for Policy
                    </p>
                    <p className="text-2xl font-light text-gray-400 mb-4">
                        <span className="bg-gray-100 rounded-md px-4 py-2">{load?.policyId}</span>
                    </p>
                    <p className="text-2xl font-light text-gray-400">
                        List of CIP-25 assets linked to the specified policy (showing 40 of {load?.total})
                    </p>
                </div>
            </div>

            {!load && <div>Please specify a valid policy id</div>}

            {!load?.items.length && <div>No assets found for the specified policy</div>}

            {!!load?.items.length &&
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16">
                    {load.items.map(dto => <AssetCard key={dto.cip25_asset.policy + dto.cip25_asset.asset} dto={dto} onSelect={setSelected} />)}
                </div>
            }


            {!!load?.policyId && !!load.nextToken && <div className="p-10 flex justify-center">
                <form method="get">
                    <input type="hidden" name="after" value={load.nextToken} />

                    <NiceSubmitButton>
                        Next Page
                    </NiceSubmitButton>
                </form>
            </div>}
        </div>
    )
}