import { LoaderFunction, useLoaderData } from "remix";
import { OuraRecord, fetchByTerm, OuraRecordPage } from "../../fetching";
import { useState } from "react";

import AssetCard from "~/components/asset-card"
import AssetModal from "~/components/asset-modal";
import { findLastTimestamp } from "~/parsing";
import { NiceSubmitButton } from "~/components/buttons";
import Navbar from "~/components/navbar";

interface Load extends OuraRecordPage {
    term: string | null,
    nextToken?: number,
}

export const loader: LoaderFunction = async ({ request }): Promise<Load | null> => {
    const url = new URL(request.url);
    const term = url.searchParams.get("term");
    if (!term) return null;

    const after = Number(url.searchParams.get("after"));

    const page = await fetchByTerm({ term, after });
    const nextToken = findLastTimestamp(page.items);

    return { ...page, term, nextToken };
};

export default function () {
    const load = useLoaderData<Load | null>();

    const [selected, setSelected] = useState<OuraRecord>();

    return (
        <>
            <Navbar />

            <div className="w-full p-5 xl:p-12">
                <AssetModal open={!!selected} dto={selected} onClose={() => setSelected(undefined)} />

                <div className="header flex items-center justify-between mb-12">
                    <div className="title">
                        <p className="text-4xl font-bold text-gray-800 mb-4">
                            Search by Term <span className="bg-gray-100 rounded-md px-4 py-2">{load?.term}</span>
                        </p>
                        <p className="text-2xl font-light text-gray-400">
                            List of CIP-25 assets matching the specified term (showing 40 of {load?.total} assets).
                        </p>
                    </div>
                </div>

                {!load && <div>Please specify a valid search term</div>}

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16">
                    {!!load?.items.length && load.items.map(dto => <AssetCard key={dto.cip25_asset.policy + dto.cip25_asset.asset} dto={dto} onSelect={setSelected} />)}
                </div>

                {!!load?.term && !!load.nextToken && <div className="p-10 flex justify-center">
                    <form method="get">
                        <input type="hidden" name="after" value={load.nextToken} />
                        <input type="hidden" name="term" value={load.term} />

                        <NiceSubmitButton>
                            Next Page
                        </NiceSubmitButton>
                    </form>
                </div>}
            </div>
        </>
    )
}
