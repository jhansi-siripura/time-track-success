
import React from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface SafeHtmlProps {
  html: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

export function SafeHtml({ 
  html, 
  className,
  allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'div', 'a'
  ],
  allowedAttributes = ['class', 'style', 'href', 'target', 'rel']
}: SafeHtmlProps) {
  const sanitizedHtml = React.useMemo(() => {
    if (!html) return '';
    
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'iframe'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
      KEEP_CONTENT: true,
      ADD_ATTR: ['target'],
      ADD_DATA_URI_TAGS: [],
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false
    });
  }, [html, allowedTags, allowedAttributes]);

  return (
    <div 
      className={cn("prose prose-sm max-w-none text-gray-800", className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        lineHeight: '1.6',
        wordBreak: 'break-word'
      }}
    />
  );
}
