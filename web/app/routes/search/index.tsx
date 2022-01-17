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

function SearchBox() {
    return (
        <div className="text-end">
            <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center">
                <div className=" relative ">
                    <input type="text" id="&quot;form-subscribe-Search" className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Enter a title" />
                </div>
                <button className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200" type="submit">
                    Search
                </button>
            </form>
        </div>
    )
}

export default function () {
    const tokens = useLoaderData<OuraRecord[]>();
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
                <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-16">
                    {tokens.map(dto => <TokenCard key={dto.cip25_asset.policy + dto.cip25_asset.asset} dto={dto} onSelect={setSelected} />)}
                </div>
            </div>
        </>
    )
}
