
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter your notes...",
  className,
  maxLength = 1000,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import ReactQuill only on client side
    const loadQuill = async () => {
      try {
        const { default: ReactQuillComponent } = await import('react-quill');
        await import('react-quill/dist/quill.snow.css');
        setReactQuill(() => ReactQuillComponent);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load ReactQuill:', error);
        setIsLoading(false);
      }
    };

    loadQuill();
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline',
    'color', 'background', 'list', 'bullet'
  ];

  const handleChange = (content: string) => {
    // Remove HTML tags for length calculation
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) {
      onChange(content);
    }
  };

  // Show loading state while Quill is loading
  if (isLoading || !ReactQuill) {
    return (
      <div className={cn("min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2", className)}>
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'white',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
        }}
      />
      <div className="text-xs text-muted-foreground mt-1">
        {value.replace(/<[^>]*>/g, '').length} / {maxLength} characters
      </div>
    </div>
  );
}
