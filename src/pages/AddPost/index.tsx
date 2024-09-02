import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Eye } from 'lucide-react';
import NavigationBar from "@/components/NavigationBar";
import RichTextEditor from '@/components/RichTextEditor';
import { addPost } from '@/firebase/firestore';

function AddPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

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
                createdAt: new Date() 
            });
            navigate('/');
        }
    };

    const openReviewModal = () => {
        setIsReviewModalOpen(true);
    };

    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16">
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
                                type="submit"
                                className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded gap-2"
                                disabled={!isFormValid}
                            >
                                <Plus size={20} />
                                Adicionar Post
                            </Button>
                        </div>
                    </form>
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