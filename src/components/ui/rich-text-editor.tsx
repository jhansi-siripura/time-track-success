
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
  placeholder = "Write your notes here...",
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
        // Import CSS
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
    // Simple, direct handling without complex logic
    if (content === '<p><br></p>') {
      // ReactQuill's default empty state - convert to empty string
      onChange('');
    } else {
      // For character counting, strip HTML tags
      const textContent = content.replace(/<[^>]*>/g, '');
      
      if (textContent.length <= maxLength) {
        onChange(content);
      }
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

  // Use value directly, let ReactQuill handle it properly
  const editorValue = value || '';

  return (
    <div className={cn("", className)}>
      <ReactQuill
        ref={quillRef}
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
        style={{
          backgroundColor: 'white',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
          minHeight: '200px', // ✅ Add this line
        }}
      />
      <div className="text-xs text-muted-foreground mt-1">
        {editorValue.replace(/<[^>]*>/g, '').length} / {maxLength} characters
      </div>
    </div>
  );
}
