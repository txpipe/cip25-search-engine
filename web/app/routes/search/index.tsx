import { LoaderFunction, useLoaderData } from "remix";
import { OuraRecord, fetchByTerm } from "../../fetching";

export const loader: LoaderFunction = async ({ request }): Promise<OuraRecord[]> => {
    let url = new URL(request.url);
    let term = url.searchParams.get("term");
    return await fetchByTerm({ term });
};

//attributes: Accessory: None, Background: Lavender, Body: Medium, Clothes: Hummingbird, Eyes: Wire, Head: Chonmage, Mouth: Meow, , , src: ipfs://QmWvEcCRBNyWZifH6ujq3t6naiptPf56WwoBq8LF4xAVXC, , , image: ipfs://QmWvEcCRBNyWZifH6ujq3t6naiptPf56WwoBq8LF4xAVXC

import { TokenCard } from "~/components/token-card"
import { TokenModal } from "~/components/token-modal";
import { useState } from "react";
import SearchBox from "~/components/search-box";

export default function () {
    const records = useLoaderData<OuraRecord[]>();

    const [selected, setSelected] = useState<OuraRecord>();

    return (
        <>
            <div className="w-full p-5 xl:p-12">
                <TokenModal open={!!selected} dto={selected} onClose={() => setSelected(undefined)} />
                <div className="header flex items-center justify-between mb-12">
                    <div className="title">
                        <p className="text-4xl font-bold text-gray-800 mb-4">
                            Token Shuffle
                        </p>
                        <p className="text-2xl font-light text-gray-400">
                            Random list of CIP-25 assets available in Cardano mainnet
                        </p>
                    </div>
                    <SearchBox />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16">
                    {records.map(dto => <TokenCard key={dto.cip25_asset.policy + dto.cip25_asset.asset} dto={dto} onSelect={setSelected} />)}
                </div>
            </div>
        </>
    )
}
