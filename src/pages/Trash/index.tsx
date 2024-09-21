import { useState, useEffect } from 'react';
import NavigationBar from "@/components/NavigationBar";
import { Post, addPost } from '@/firebase/firestore';
import { Trash2, RefreshCw, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const TRASH_STORAGE_KEY = 'trashedPosts';
const RETENTION_PERIOD = 7 * 24 * 60 * 60 * 1000;

interface TrashedPost extends Post {
    deletedAt: number;
}

function TrashPage() {
    const [trashedPosts, setTrashedPosts] = useState<TrashedPost[]>([]);
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadTrashedPosts();
    }, []);

    const loadTrashedPosts = () => {
        const storedPosts = localStorage.getItem(TRASH_STORAGE_KEY);
        if (storedPosts) {
            const parsedPosts: TrashedPost[] = JSON.parse(storedPosts);
            const currentTime = Date.now();
            const validPosts = parsedPosts.filter(post => currentTime - post.deletedAt < RETENTION_PERIOD);
            setTrashedPosts(validPosts);
            
            if (validPosts.length !== parsedPosts.length) {
                localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(validPosts));
            }
        }
    };

    const deletePostPermanently = (postId: string) => {
        const updatedPosts = trashedPosts.filter(post => post.id !== postId);
        setTrashedPosts(updatedPosts);
        localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updatedPosts));
        toast({
            title: "Post excluído permanentemente",
            description: "O post foi removido da lixeira.",
        });
    };

    const restorePost = async (postId: string) => {
        setIsRestoring(true);
        try {
            const postToRestore = trashedPosts.find(post => post.id === postId);
            if (postToRestore) {
                const newPost: Omit<Post, 'id'> = {
                    title: postToRestore.title,
                    content: postToRestore.content,
                    description: postToRestore.description,
                    coverImage: postToRestore.coverImage,
                    isDraft: false,
                    createdAt: new Date(),
                };

                await addPost(newPost);

                const updatedPosts = trashedPosts.filter(post => post.id !== postId);
                setTrashedPosts(updatedPosts);
                localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(updatedPosts));

                toast({
                    title: "Post restaurado",
                    description: "Um novo post foi criado com as informações do post deletado.",
                });
            }
        } catch (error) {
            console.error("Error restoring post:", error);
            toast({
                title: "Erro ao restaurar post",
                description: "Ocorreu um erro ao tentar restaurar o post. Por favor, tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsRestoring(false);
        }
    };

    const deleteAllPermanently = () => {
        setTrashedPosts([]);
        localStorage.removeItem(TRASH_STORAGE_KEY);
        setConfirmDeleteAll(false);
        toast({
            title: "Todos os posts foram excluídos permanentemente",
            description: "A lixeira foi esvaziada.",
        });
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-full sm:w-4/5 md:w-5/5 lg:w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16 overflow-auto">
                    <code className="text-4xl text-neutral-200 text-extrabold mb-8 block">Lixeira</code>
                    {trashedPosts.length === 0 ? (
                        <p className="text-neutral-500">A lixeira está vazia.</p>
                    ) : (
                        <>
                            <Button onClick={() => setConfirmDeleteAll(true)} variant="destructive" className="mb-4 gap-2">
                                <Trash2 size={18} />
                                Deletar Todos Permanentemente
                            </Button>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                {trashedPosts.map((post) => (
                                    <div key={post.id} className="bg-neutral-900 p-4 rounded-lg mb-4">  
                                        <img 
                                            src={post.coverImage} 
                                            alt={`Cover for ${post.title}`} 
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                        <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                                        <p className="text-gray-300 mb-2">{post.description}</p>
                                        <p className="text-gray-400 text-sm mb-2">
                                            Deletado em: {formatDate(post.deletedAt)}
                                        </p>
                                        <div className="flex justify-end space-x-2">
                                            <Button 
                                                onClick={() => restorePost(post.id)} 
                                                className="flex gap-2"
                                                disabled={isRestoring}
                                            >
                                                <RefreshCw size={18} />
                                                {isRestoring ? 'Restaurando...' : 'Restaurar'}
                                            </Button>
                                            <Button 
                                                onClick={() => deletePostPermanently(post.id)} 
                                                variant="destructive" 
                                                className="flex gap-2"
                                            >
                                                <Trash2 size={18} />
                                                Deletar Permanentemente
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>

            <Dialog open={confirmDeleteAll} onOpenChange={setConfirmDeleteAll}>
                <DialogContent className="sm:max-w-[425px] bg-neutral-950 border-none">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-neutral-200"><code>Confirmar Exclusão</code></DialogTitle>
                    </DialogHeader>
                    <p className="text-neutral-300">Tem certeza que deseja deletar permanentemente todos os posts da lixeira? Esta ação não pode ser desfeita.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteAll(false)} className="flex gap-2 text-white hover:text-white border-none bg-neutral-700 hover:bg-neutral-600">
                            <X size={18} />
                            Cancelar
                        </Button>
                        <Button onClick={deleteAllPermanently} variant="destructive" className="flex gap-2">
                            <Trash2 size={18} />
                            Deletar Tudo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Toaster />
        </>
    )
}

export default TrashPage;