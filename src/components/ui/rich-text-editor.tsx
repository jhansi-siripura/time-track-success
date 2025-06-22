
import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const lastValueRef = useRef<string>('');

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

  const handleChange = useCallback((content: string) => {
    // Prevent infinite loops by checking if content actually changed
    if (content === lastValueRef.current) {
      return;
    }
    
    lastValueRef.current = content;
    
    // Clean the content - remove empty paragraphs and normalize
    let cleanContent = content || '';
    
    // Remove consecutive empty paragraphs
    cleanContent = cleanContent.replace(/<p><br><\/p>/g, '');
    cleanContent = cleanContent.replace(/<p>\s*<\/p>/g, '');
    
    // If content is just empty paragraph tags, set to empty string
    if (cleanContent === '<p><br></p>' || cleanContent === '<p></p>') {
      cleanContent = '';
    }
    
    // For character counting, strip HTML tags
    const textContent = cleanContent.replace(/<[^>]*>/g, '');
    
    if (textContent.length <= maxLength) {
      onChange(cleanContent);
    }
  }, [onChange, maxLength]);

  // Show loading state while Quill is loading
  if (isLoading || !ReactQuill) {
    return (
      <div className={cn("min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2", className)}>
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  // Clean and prepare the value for ReactQuill
  let displayValue = value || '';
  
  // Update the ref when value changes externally
  if (displayValue !== lastValueRef.current) {
    lastValueRef.current = displayValue;
  }

  return (
    <div className={cn("", className)}>
      <ReactQuill
        ref={quillRef}
        value={displayValue}
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
        {displayValue.replace(/<[^>]*>/g, '').length} / {maxLength} characters
      </div>
    </div>
  );
}
