import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from "@/components/NavigationBar";
import { getPosts, Post } from '@/firebase/firestore';
import SearchBar from '@/components/SearchBar';

function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
        };
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen md:w-5/5 lg:w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16 overflow-auto">
                    <code className="text-4xl text-neutral-200 text-extrabold mb-8 block">Posts</code>
                    <SearchBar 
                      searchTerm={searchTerm} 
                      setSearchTerm={setSearchTerm} 
                      placeholder="Pesquisar posts..."
                    />
                    <div className="grid grid-cols-2 gap-6">
                        {filteredPosts.map((post) => (
                            <Link to={`/post/${post.id}`} key={post.id} className="block">
                                <div className="bg-neutral-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <img 
                                    src={post.coverImage} 
                                    alt={`Capa de ${post.title}`} 
                                    className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                                        <p className="text-gray-300 mb-2 line-clamp-2">{post.description}</p>
                                        <p className="text-gray-400 text-sm mb-4">
                                            {post.createdAt instanceof Date 
                                            ? formatDate(post.createdAt)
                                            : formatDate(new Date(post.createdAt))}
                                        </p>
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