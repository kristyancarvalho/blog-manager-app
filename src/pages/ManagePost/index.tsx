import { useState, useEffect } from 'react';
import NavigationBar from "@/components/NavigationBar";
import { getPosts, updatePost, deletePost, Post } from '@/firebase/firestore';

function ManagePost() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
        };
        fetchPosts();
    }, []);

    const handleEdit = (post: Post) => {
        setEditingPost(post);
    };

    const handleUpdate = async () => {
        if (editingPost && editingPost.id) {
            await updatePost(editingPost.id, {
                title: editingPost.title,
                content: editingPost.content
            });
            setEditingPost(null);
            const updatedPosts = await getPosts();
            setPosts(updatedPosts);
        }
    };

    const handleDelete = async (id: string) => {
        await deletePost(id);
        const updatedPosts = await getPosts();
        setPosts(updatedPosts);
    };

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16 overflow-auto">
                    <code className="text-4xl text-neutral-200 text-extrabold mb-8 block">Gerenciar Posts</code>
                    {posts.map((post) => (
                        <div key={post.id} className="mb-4 p-4 bg-gray-800 rounded">
                            {editingPost && editingPost.id === post.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingPost.title}
                                        onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                        className="w-full p-2 rounded bg-gray-700 text-white mb-2"
                                    />
                                    <textarea
                                        value={editingPost.content}
                                        onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                                        className="w-full p-2 rounded bg-gray-700 text-white mb-2 h-20"
                                    />
                                    <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded mr-2">
                                        Salvar
                                    </button>
                                    <button onClick={() => setEditingPost(null)} className="px-4 py-2 bg-gray-500 text-white rounded">
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl text-white">{post.title}</h2>
                                    <p className="text-gray-300">{post.content}</p>
                                    <button onClick={() => handleEdit(post)} className="px-4 py-2 bg-blue-500 text-white rounded mr-2 mt-2">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(post.id!)} className="px-4 py-2 bg-red-500 text-white rounded mt-2">
                                        Deletar
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </main>
            </div>
        </>
    )
}

export default ManagePost