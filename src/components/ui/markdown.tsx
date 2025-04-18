import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
          p: ({ children }) => <p className="text-gray-700 mb-4">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">{children}</ul>,
          li: ({ children }) => <li className="mb-2">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 font-medium">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}; 