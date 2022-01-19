import { LoaderFunction, useLoaderData } from "remix";
import AssetCard from "~/components/asset-card";
import { GithubIcon } from "~/components/custom-icons";
import { fetchShuffle, OuraRecordPage } from "~/fetching";

export const loader: LoaderFunction = async (): Promise<OuraRecordPage> => {
    return await fetchShuffle({});
};

function Intro(props: { totalIndexed: number }) {
    return (
        <div className="bg-white rounded-2xl border-4 p-12 border-dashed border-indigo-700">
            <h1 className="tracking-tight font-extrabold text-gray-900 titleHome text-6xl ">
                <span className="flex w-full m-auto text-indigo-600">
                    Oura Demo
                </span>
                <span className="block font-bold xl:inline">
                    CIP-25 Search Engine
                </span>
            </h1>
            <h2 className="mt-3 text-gray-500 sm:mt-5 text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                This is a reference app that shows how to leverage Oura, Elasticsearch, React and Kubernetes to build a search engine for Cardano blockchain metadata compliant with CIP-25.
            </h2>
            <p className="mt-3 text-gray-500 sm:mt-5 text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                It currently holds a total of <span className="bg-fuchsia-200 text-fuchsia-600 px-4 py-2 rounded-full">{props.totalIndexed}</span> assets.
            </p>
            <p className="mt-3 text-gray-400 sm:mt-5 text-sm sm:max-w-xl sm:mx-auto md:mt-5 md:text-sm lg:mx-0">
                WARNING: Transaction metadata is not moderated, and it may contain inappropriate content. The creator of the transaction provides this information and is not in control of this website's operator. By continuing, you agree to see unmoderated content.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                    <a className="w-full flex items-center justify-center px-8 py-3  text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" href="/shuffle">
                        Browse Assets
                    </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a target="_blank" rel="noreferrer" href="https://github.com/txpipe/cip25-search-engine" className="w-full flex items-center justify-center px-8 py-3  text-base font-medium rounded-md text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2">
                        <GithubIcon className="ml-2" />
                        <span className="ml-2">
                            Github Repo
                        </span>
                    </a>
                </div>
            </div>
        </div>

    )
}

export default function Index() {
    const records = useLoaderData<OuraRecordPage>();

    return (
        <main className="relative bg-white overflow-hidden w-screen h-screen">
            <div className="absolute left-0 top-0 bottom-0 right-0 overflow-hidden">
                <div className="flex-grow grid grid-cols-6 gap-10">
                    {records.items.map(dto => <AssetCard key={dto.cip25_asset.policy + dto.cip25_asset.asset} dto={dto} />)}
                </div>
            </div>
            <div className="relative w-full flex flex-col items-center justify-center h-full backdrop-blur-sm bg-indigo-600/30">
                <Intro totalIndexed={records.total} />
            </div>

        </main>
    );
}
