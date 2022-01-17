import { useLoaderData, LoaderFunction } from "remix";

export const loader: LoaderFunction = async ({ params }) => {
    return { slug: params.slug };
}

export default function Post() {
    const data = useLoaderData();
    return <h1>{data.slug}</h1>
}