import { HomeIcon  } from "@heroicons/react/solid"
import { GithubIcon } from "./custom-icons";
import SearchBox from "./search-box";

export default function Navbar() {
    return (
        <div className="flex justify-between items-center p-4 bg-gray-100">
            <div className="mr-4">
                <a href="/" className="rounded-2xl px-4 py-2 bg-gray-200 text-gray-500 text-lg inline-block"><HomeIcon className="h-7 w-7" /></a>
            </div>
            <div className="mr-4">
                <h1 className="tracking-tight font-extrabold text-gray-900 text-2xl ">
                    <span className="m-auto text-indigo-600">Oura Demo</span> &gt; <span>CIP-25 Search Engine</span>
                </h1>
            </div>
            <div className="mr-4">
                <a href="/shuffle" className="rounded-2xl px-4 py-2 bg-gray-200 text-gray-500 text-lg">Random Shuffle</a>
            </div>
            <div className="mr-4">
                <SearchBox />
            </div>
            <div className="flex-grow" />
            <div className="mr-4">
                <a href="https://github.com/txpipe/cip25-search-engine" className="text-gray-700 text-lg inline-block"><GithubIcon className="h-10 w-10" /></a>
            </div>
        </div>
    )
}