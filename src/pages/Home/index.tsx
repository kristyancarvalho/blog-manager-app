import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from "@/components/NavigationBar";
import { getPosts, Post } from '@/firebase/firestore';

function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
        };
        fetchPosts();
    }, []);

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16 overflow-auto">
                    <code className="text-4xl text-neutral-200 text-extrabold mb-8 block">Posts</code>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Link to={`/post/${post.id}`} key={post.id} className="block">
                                <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h2 className="text-xl text-white font-bold mb-2">{post.title}</h2>
                                        <p className="text-gray-300 text-sm">{post.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </>
    )
}

export default HomePage