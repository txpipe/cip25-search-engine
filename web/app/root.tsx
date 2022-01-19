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
                    <Outlet />
                    <ScrollRestoration />
                    <Scripts />
                    {process.env.NODE_ENV === "development" && <LiveReload />}
                </div>
            </body>
        </html>
    );
}
