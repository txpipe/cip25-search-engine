import {
    Link,
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from "remix";

import type { MetaFunction } from "remix";

export const meta: MetaFunction = () => {
    return { title: "CIP-25 Search Engine" };
};

import styles from "./tailwind.css";
import SearchBox from "./components/search-box";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <div>
                    <div className="flex justify-between items-center p-4 bg-gray-100">
                        <div className="mr-4 flex-grow">
                            <h1 className="tracking-tight font-extrabold text-gray-900 text-2xl ">
                                <span className="m-auto text-indigo-600">Oura Demo</span> &gt; <span>CIP-25 Search Engine</span>
                            </h1>
                        </div>
                        <div className="mr-4">
                            <a href="/" className="rounded-2xl px-4 py-2 bg-gray-200 text-gray-500 text-lg">Home</a>
                        </div>
                        <div className="mr-4">
                            <a href="/shuffle" className="rounded-2xl px-4 py-2 bg-gray-200 text-gray-500 text-lg">Random Shuffle</a>
                        </div>
                        <div className="mr-4">
                            <SearchBox />
                        </div>
                    </div>
                    <Outlet />
                    <ScrollRestoration />
                    <Scripts />
                    {process.env.NODE_ENV === "development" && <LiveReload />}
                </div>
            </body>
        </html>
    );
}
