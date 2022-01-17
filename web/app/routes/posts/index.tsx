import { Link, useLoaderData } from "remix";

export type Post = {
    slug: string;
    title: string;
};

export const loader = () => {
    const posts: Post[] = [
        {
            slug: "my-first-post",
            title: "My First Post"
        },
        {
            slug: "90s-mixtape",
            title: "A Mixtape I Made Just For You"
        }
    ];
    return posts;
};

export default function Posts() {
    const posts = useLoaderData<Post[]>();

    return (
        <div>
            <h1>Posts</h1>
            {posts.map(i => <div><Link key={i.slug} to={`/posts/${i.slug}`}>{i.title}</Link></div>)}
        </div>
    );
}