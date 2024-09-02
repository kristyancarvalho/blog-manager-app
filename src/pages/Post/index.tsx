import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavigationBar from "@/components/NavigationBar";
import { getPost, Post } from '@/firebase/firestore';

function PostPage() {
    const [post, setPost] = useState<Post | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPost = async () => {
            if (id) {
                const fetchedPost = await getPost(id);
                setPost(fetchedPost);
            }
        };
        fetchPost();
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16 overflow-auto">
                    <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-8" />
                    <h1 className="text-4xl text-white font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-300 mb-8">{post.description}</p>
                    <div className="text-white">{post.content}</div>
                </main>
            </div>
        </>
    )
}

export default PostPage