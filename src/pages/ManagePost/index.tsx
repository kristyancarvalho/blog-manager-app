import { useState, useEffect } from 'react';
import NavigationBar from "@/components/NavigationBar";
import SearchBar from "@/components/SearchBar";
import { getPosts, updatePost, deletePost, Post } from '@/firebase/firestore';
import { Edit, Save, Trash2, X } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

function ManagePost() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPost, setEditingPost] = useState<Post | null>(null);

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
    const handleEdit = (post: Post) => {
        setEditingPost(post);
    };

    const handleUpdate = async () => {
        if (editingPost && editingPost.id) {
            await updatePost(editingPost.id, {
                title: editingPost.title,
                content: editingPost.content,
                description: editingPost.description,
            });
            setEditingPost(null);
            const updatedPosts = await getPosts();
            setPosts(updatedPosts);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja deletar este post?')) {
            await deletePost(id);
            const updatedPosts = await getPosts();
            setPosts(updatedPosts);
        }
    };

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen md:w-5/5 lg:w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16 overflow-auto">
                    <code className="text-4xl text-neutral-200 text-extrabold mb-8 block">Gerenciar Posts</code>
                    
                    <SearchBar 
                      searchTerm={searchTerm} 
                      setSearchTerm={setSearchTerm} 
                      placeholder="Pesquisar posts para gerenciar..."
                    />

                    <div className="grid grid-cols-2 gap-6">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className="bg-neutral-900 rounded-lg overflow-hidden">
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
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition duration-300"
                                        >
                                        <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => post.id && handleDelete(post.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                                        >
                                        <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
                        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-neutral-950 border-none">
                        <DialogHeader>
                            <DialogTitle className="text-3xl text-neutral-200 mb-4"><code>Editar Post</code></DialogTitle>
                        </DialogHeader>
                            {editingPost && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Título</h3>
                                        <Input
                                            value={editingPost.title}
                                            onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                            className="mb-2 p-2 w-full bg-neutral-800 text-white rounded border-none"
                                            placeholder="Título"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Descrição</h3>
                                        <textarea 
                                            value={editingPost.description} 
                                            onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                                            className="mb-2 p-2 w-full bg-neutral-800 text-white rounded border-none"
                                            placeholder="Descrição"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Imagem de Capa</h3>
                                        <Input
                                            type="text"
                                            value={editingPost.coverImage}
                                            onChange={(e) => setEditingPost({...editingPost, coverImage: e.target.value})}
                                            className="mb-2 p-2 w-full bg-neutral-800 text-white rounded border-none"
                                            placeholder="URL da imagem de capa"
                                        />
                                        {editingPost.coverImage && (
                                            <img 
                                                src={editingPost.coverImage} 
                                                alt="Prévia da capa" 
                                                className="mt-2 max-w-full h-auto rounded"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Conteúdo</h3>
                                        <RichTextEditor 
                                            value={editingPost.content}
                                            onChange={(content) => setEditingPost({...editingPost, content})}
                                            placeholder="Escreva o conteúdo do post aqui..."
                                        />
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setEditingPost(null)} className="flex gap-2 text-white hover:text-white  border-none bg-red-500 hover:bg-red-600 transition-all transition-duration-300">
                                            <X size={18} />
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleUpdate} className='flex gap-2 bg-violet-500 hover:bg-violet-600 transition-all transition-duration-300'>
                                            <Save size={18} />
                                            Atualizar
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </>
    )
}

export default ManagePost;