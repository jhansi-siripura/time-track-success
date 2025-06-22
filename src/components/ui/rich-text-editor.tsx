
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
    // Ensure we get the raw HTML content from ReactQuill
    // ReactQuill returns HTML content, not encoded entities
    const rawContent = content || '';
    
    // For character counting, strip HTML tags
    const textContent = rawContent.replace(/<[^>]*>/g, '');
    
    if (textContent.length <= maxLength) {
      // Pass the raw HTML content to the parent
      onChange(rawContent);
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

  // Ensure we pass clean HTML value to ReactQuill
  // If value contains encoded entities, decode them
  const cleanValue = value || '';
  
  // Decode HTML entities if they exist (this handles cases where encoded content was saved)
  const decodedValue = cleanValue
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");

  return (
    <div className={cn("", className)}>
      <ReactQuill
        ref={quillRef}
        value={decodedValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
        style={{
          backgroundColor: 'white',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
        }}
      />
      <div className="text-xs text-muted-foreground mt-1">
        {decodedValue.replace(/<[^>]*>/g, '').length} / {maxLength} characters
      </div>
    </div>
  );
}
