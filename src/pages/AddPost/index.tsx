import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Save, Trash2, Upload, } from 'lucide-react';
import NavigationBar from "@/components/NavigationBar";
import RichTextEditor from '@/components/RichTextEditor';
import { addPost } from '@/firebase/firestore';

interface DraftPost {
    id: string;
    title: string;
    content: string;
    description: string;
    coverImage: string;
    lastSaved: Date;
}

const DRAFTS_STORAGE_KEY = 'postDrafts';

function AddPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [drafts, setDrafts] = useState<DraftPost[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedDrafts = localStorage.getItem(DRAFTS_STORAGE_KEY);
        if (savedDrafts) {
            setDrafts(JSON.parse(savedDrafts));
        }
    }, []);

    useEffect(() => {
        setIsFormValid(
            title.trim() !== '' && 
            content.trim() !== '' && 
            description.trim() !== '' && 
            coverImage.trim() !== ''
        );
    }, [title, content, description, coverImage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            await addPost({ 
                title, 
                content, 
                description,
                coverImage,
                createdAt: new Date(),
                isDraft: false
            });
            navigate('/');
        }
    };

    const openReviewModal = () => {
        setIsReviewModalOpen(true);
    };

    const saveDraft = () => {
        const newDraft: DraftPost = {
            id: Date.now().toString(),
            title,
            content,
            description,
            coverImage,
            lastSaved: new Date()
        };
        const updatedDrafts = [...drafts, newDraft];
        setDrafts(updatedDrafts);
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
        alert('Rascunho salvo com sucesso!');
    };

    const loadDraft = (draft: DraftPost) => {
        setTitle(draft.title);
        setContent(draft.content);
        setDescription(draft.description);
        setCoverImage(draft.coverImage);
    };

    const deleteDraft = (id: string) => {
        const updatedDrafts = drafts.filter(draft => draft.id !== id);
        setDrafts(updatedDrafts);
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
    };

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
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-4/5 flex items-center justify-center p-8">
                <main className="w-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16">
                    <code className="text-4xl text-neutral-200 text-extrabold mb-8 block">Postar</code>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">Título do Post <strong className='text-red-500/70'>*</strong></label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Título"
                                className="w-full p-6 rounded bg-neutral-900 border-none text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">Descrição Breve <strong className='text-red-500/70'>*</strong></label>
                            <Input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descrição breve"
                                className="w-full p-6 pb-16 rounded bg-neutral-900 border-none text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="coverImage" className="block text-sm font-medium text-white/80 mb-2">Imagem de Capa <strong className='text-red-500/70'>*</strong></label>
                            <Input
                                id="coverImage"
                                type="text"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="URL da imagem de capa"
                                className="w-full p-6 rounded bg-neutral-900 border-none text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-white/80 mb-2">Conteúdo do Post <strong className='text-red-500/70'>*</strong></label>
                            <RichTextEditor
                                id="content"
                                value={content}
                                onChange={setContent}
                                placeholder="Escreva o conteúdo do seu post aqui..."
                                className={`text-white ${content.trim() === '' ? 'border-red-500' : ''}`}
                                required
                            />
                        </div>
                        <div className="flex space-x-4">
                            <Button
                                type="button"
                                onClick={openReviewModal}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded gap-2"
                                disabled={!isFormValid}
                            >
                                <Eye size={20} />
                                Revisar Post
                            </Button>
                            <Button
                                type="button"
                                onClick={saveDraft}
                                disabled={!isFormValid}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded gap-2"
                            >
                                <Save size={20} />
                                Salvar Rascunho
                            </Button>
                            <Button
                                type="submit"
                                className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded gap-2"
                                disabled={!isFormValid}
                            >
                                <Plus size={20} />
                                Adicionar Post
                            </Button>
                        </div>
                    </form>
                    <div className="mt-8 flex flex-col space-y-4 mb-4">
                        <code>
                            <h2 className="text-2xl font-bold text-neutral-200">Rascunhos Salvos</h2>
                        </code>
                        <div className="max-h-60 overflow-y-auto pr-2">
                            {drafts.map((draft) => (
                                <div key={draft.id} className="bg-neutral-900 p-2 rounded-lg mb-2 flex justify-between items-center">
                                    <img 
                                        src={draft.coverImage} 
                                        alt={draft.title} 
                                        className='w-32 h-16 rounded mr-4'
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-200">{draft.title}</h3>
                                        <p className="text-sm text-neutral-400">Salvo em: {formatDate(new Date(draft.lastSaved))}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button 
                                            onClick={() => loadDraft(draft)}
                                            size="sm"
                                            className="flex items-center gap-2 text-white bg-blue-500 hover:bg-blue-600"
                                        >
                                            <Upload size={16} />
                                            Carregar
                                        </Button>
                                        <Button 
                                            onClick={() => deleteDraft(draft.id)} 
                                            variant="destructive" 
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Trash2 size={16} />
                                            Excluir
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="sm:max-w-[700px] bg-black text-white border border-neutral-800 rounded-3xl shadow-black/60 shadow-900 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl text-neutral-200 mb-4"><code>Revisão do Post</code></DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div>
                            <h3 className="text-xl font-bold text-neutral-200/90 mb-2">Título</h3>
                            <p className="text-neutral-300">{title}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-200/90 mb-2">Descrição</h3>
                            <p className="text-neutral-300">{description}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-200/90 mb-2">Imagem de Capa</h3>
                            <img src={coverImage} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
                        </div>
                        <div className="w-full">
                            <h3 className="text-xl font-bold text-neutral-200/90 mb-2">Conteúdo</h3>
                            <div className="w-full max-h-60 overflow-y-auto bg-neutral-900 p-4 rounded-lg">
                                <div className="prose prose-invert prose-sm max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: content }} className="break-words whitespace-pre-wrap" />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddPost;