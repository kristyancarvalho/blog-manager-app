import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  id, 
  required,
  className
}) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (required && quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.setAttribute('required', 'required');
    }
  }, [required]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div 
      id={id} 
      className={cn(
        "rounded-md border-none bg-neutral-900 text-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
        className
      )}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className="quill-editor"
      />
    </div>
  );
};

export default RichTextEditor;