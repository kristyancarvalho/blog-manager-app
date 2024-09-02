import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from "@/components/NavigationBar";
import { addPost } from '@/firebase/firestore';

function AddPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addPost({ 
            title, 
            content, 
            description,
            coverImage,
            createdAt: new Date() 
        });
        navigate('/');
    };

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16">
                    <code className="text-4xl text-neutral-200 text-extrabold mb-8 block">Postar</code>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título"
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição breve"
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                        <input
                            type="text"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="URL da imagem de capa"
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Conteúdo"
                            className="w-full p-2 rounded bg-gray-800 text-white h-40"
                        />
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            Adicionar Post
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export default AddPost