
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
  placeholder = 'Write your notes here...',
  className,
  maxLength = 1000,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ─────────────────────────────────────────
     Dynamically load ReactQuill on the client
  ───────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const { default: ReactQuillComponent } = await import('react-quill');
        await import('react-quill/dist/quill.snow.css');
        setReactQuill(() => ReactQuillComponent);
      } catch (err) {
        console.error('Failed to load ReactQuill:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'color',
    'background',
    'list',
    'bullet',
  ];

  const handleChange = (content: string) => {
    // strip tags only for the live character count
    const plain = content.replace(/<[^>]*>/g, '');
    if (plain.length <= maxLength) {
      onChange(content === '<p><br></p>' ? '' : content);
    }
  };

  /* ─────────────────────────────────────────
     Loading skeleton
  ───────────────────────────────────────── */
  if (isLoading || !ReactQuill) {
    return (
      <div
        className={cn(
          'min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2',
          className
        )}
      >
        <p className="text-muted-foreground">Loading editor…</p>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     Editor
  ───────────────────────────────────────── */
  const editorValue = value || '';

  return (
    <div className={cn('', className)}>
      <ReactQuill
        ref={quillRef}
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
        className="custom-quill"
        style={{
          backgroundColor: 'white',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
        }}
      />
      <div className="text-xs text-muted-foreground mt-1">
        {editorValue.replace(/<[^>]*>/g, '').length} / {maxLength} characters
      </div>
    </div>
  );
}
