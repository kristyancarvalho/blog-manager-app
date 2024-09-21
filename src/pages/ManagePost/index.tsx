import { useState, useEffect } from 'react';
import NavigationBar from "@/components/NavigationBar";
import SearchBar from "@/components/SearchBar";
import { getPosts, updatePost, deletePost, Post } from '@/firebase/firestore';
import { Edit, Save, Trash2, X } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/Skeleton';

function ManagePost() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const fetchedPosts = await getPosts();
                setPosts(fetchedPosts);
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = posts
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .filter(post =>
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
                coverImage: editingPost.coverImage,
            });
            setEditingPost(null);
            const updatedPosts = await getPosts();
            setPosts(updatedPosts);
        }
    };

  const handleDelete = async (id: string | undefined) => {
      if (id && window.confirm('Tem certeza que deseja deletar este post?')) {
          const postToDelete = posts.find(post => post.id === id);
          if (postToDelete) {
              const TRASH_STORAGE_KEY = 'trashedPosts';
              const storedPosts = localStorage.getItem(TRASH_STORAGE_KEY);
              const trashedPosts = storedPosts ? JSON.parse(storedPosts) : [];
              trashedPosts.push({
                  ...postToDelete,
                  deletedAt: Date.now()
              });
              localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(trashedPosts));
  
              await deletePost(id);
              const updatedPosts = await getPosts();
              setPosts(updatedPosts);
          }
      }
  };
    const PostSkeleton = () => (
        <div className="bg-neutral-900 p-4 rounded-lg mb-4 flex">
            <Skeleton className="w-32 h-32 mr-4" />
            <div className="flex-grow">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-1/4 h-4 mb-2" />
                <div className="flex justify-end space-x-2 mt-2">
                    <Skeleton className="w-20 h-8" />
                    <Skeleton className="w-20 h-8" />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16 overflow-auto">
                    <code className="text-4xl text-neutral-200 text-extrabold mb-8 block">Gerenciar Posts</code>
                    <SearchBar 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        placeholder="Pesquisar posts..."
                    />
                    {loading ? (
                        [...Array(5)].map((_, index) => (
                            <PostSkeleton key={index} />
                        ))
                    ) : (
                        filteredPosts.map((post) => (
                            <div key={post.id} className="bg-neutral-900 p-4 rounded-lg mb-4 flex">
                                <img 
                                    src={post.coverImage} 
                                    alt={`Capa de ${post.title}`} 
                                    className="w-32 h-32 object-cover rounded-lg mr-4"
                                />
                                <div className="flex-grow">
                                    <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                                    <p className="text-gray-300 mb-2">{post.description}</p>
                                    <p className="text-gray-400 text-sm mb-2">
                                        {formatDate(post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt))}
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <Button onClick={() => handleEdit(post)} className="flex gap-2">
                                            <Edit size={18} />
                                            Editar
                                        </Button>
                                        <Button onClick={() => post.id && handleDelete(post.id)} variant="destructive" className="flex gap-2">
                                            <Trash2 size={18} />
                                            Deletar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
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