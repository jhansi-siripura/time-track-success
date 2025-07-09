
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
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'div', 'a',
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'img', 'hr'
  ],
  allowedAttributes = [
    'class', 'style', 'href', 'target', 'rel', 'src', 'alt', 'title',
    'width', 'height', 'colspan', 'rowspan', 'align', 'color'
  ]
}: SafeHtmlProps) {
  const sanitizedHtml = React.useMemo(() => {
    if (!html) return '';
    
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'iframe'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onsubmit'],
      KEEP_CONTENT: true,
      ADD_ATTR: ['target'],
      ADD_DATA_URI_TAGS: [],
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false,
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
  }, [html, allowedTags, allowedAttributes]);

  return (
    <div 
      className={cn(
        // Base styles for rich text
        "rich-text-content",
        // Typography
        "text-sm leading-relaxed",
        // List styles
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1",
        "[&_li]:pl-1",
        // Nested lists
        "[&_ul_ul]:list-disc [&_ol_ol]:list-decimal",
        "[&_ul_ol]:list-decimal [&_ol_ul]:list-disc",
        // Paragraph spacing
        "[&_p]:mb-2 [&_p:last-child]:mb-0",
        // Text formatting
        "[&_strong]:font-semibold [&_b]:font-bold",
        "[&_em]:italic [&_i]:italic",
        "[&_u]:underline [&_s]:line-through",
        // Headings
        "[&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2",
        "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2",
        "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:mb-1",
        // Code
        "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono",
        "[&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-xs [&_pre]:font-mono [&_pre]:whitespace-pre-wrap",
        // Blockquotes
        "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2",
        // Links
        "[&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800",
        // Tables
        "[&_table]:border-collapse [&_table]:w-full [&_table]:text-xs",
        "[&_th]:border [&_th]:border-gray-300 [&_th]:px-2 [&_th]:py-1 [&_th]:bg-gray-50 [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-1",
        // Images
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded",
        // Horizontal rules
        "[&_hr]:border-gray-300 [&_hr]:my-2",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        lineHeight: '1.6',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap'
      }}
    />
  );
}
