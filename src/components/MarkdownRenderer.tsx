import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Theme } from './ThemeSelector';

interface MarkdownRendererProps {
  markdown: string;
  darkMode: boolean;
  fontSize: string;
  theme: Theme;
}

const themeStyles = {
  modern: {
    h1: {
      wrapper: "bg-gradient-to-r from-purple-600 to-pink-600",
      number: "bg-purple-800",
      text: "text-white"
    },
    h2: "bg-purple-50 dark:bg-purple-900/20 pl-4 py-2 rounded-lg",
    h3: "border-l-4 border-purple-600 pl-4",
    blockquote: "border-l-4 border-pink-500 bg-pink-50 dark:bg-pink-900/20",
    table: {
      header: "bg-purple-100 dark:bg-purple-900/40",
      cell: "border-purple-200 dark:border-purple-700",
      row: "hover:bg-purple-50 dark:hover:bg-purple-900/20"
    }
  },
  vintage: {
    h1: {
      wrapper: "bg-gradient-to-r from-amber-700 to-brown-800",
      number: "bg-brown-900",
      text: "text-amber-100"
    },
    h2: "bg-amber-50 dark:bg-amber-900/20 pl-4 py-2 rounded-lg",
    h3: "border-l-4 border-amber-600 pl-4",
    blockquote: "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20",
    table: {
      header: "bg-amber-100 dark:bg-amber-900/40",
      cell: "border-amber-200 dark:border-amber-700",
      row: "hover:bg-amber-50 dark:hover:bg-amber-900/20"
    }
  },
  minimal: {
    h1: {
      wrapper: "bg-gray-100 dark:bg-gray-800",
      number: "bg-gray-700 dark:bg-gray-900",
      text: "text-gray-900 dark:text-gray-100"
    },
    h2: "bg-gray-50 dark:bg-gray-800/50 pl-4 py-2 rounded-lg",
    h3: "border-l-4 border-gray-300 pl-4",
    blockquote: "border-l-4 border-gray-300 bg-gray-50 dark:bg-gray-800",
    table: {
      header: "bg-gray-100 dark:bg-gray-800/40",
      cell: "border-gray-200 dark:border-gray-700",
      row: "hover:bg-gray-50 dark:hover:bg-gray-800/20"
    }
  },
  nature: {
    h1: {
      wrapper: "bg-gradient-to-r from-green-600 to-emerald-600",
      number: "bg-green-800",
      text: "text-white"
    },
    h2: "bg-green-50 dark:bg-green-900/20 pl-4 py-2 rounded-lg",
    h3: "border-l-4 border-green-600 pl-4",
    blockquote: "border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20",
    table: {
      header: "bg-green-100 dark:bg-green-900/40",
      cell: "border-green-200 dark:border-green-700",
      row: "hover:bg-green-50 dark:hover:bg-green-900/20"
    }
  }
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown, darkMode, fontSize, theme }) => {
  // Process multi-line notes
  const processedMarkdown = markdown.replace(
    />>([^<]+)<</gs,
    (_, content) => content.split('\n').map(line => `> ${line}`).join('\n')
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => {
          try {
            const text = children?.toString() || '';
            const firstChar = text.trim().match(/^[A-Za-z0-9]|[A-Za-z0-9]/)?.[0] || '1';
            const styles = themeStyles[theme];
            
            return (
              <div className={`flex items-stretch mb-6 print:break-after-avoid ${styles.h1.wrapper}`}>
                <div className={`flex items-center justify-center ${styles.h1.number} text-white text-4xl font-bold w-24 h-24`}>
                  {firstChar}
                </div>
                <div className="flex-1 flex items-center px-6">
                  <h1 className={`text-3xl font-bold m-0 ${styles.h1.text}`}>{text}</h1>
                </div>
              </div>
            );
          } catch (error) {
            console.error('Error rendering h1:', error);
            return <h1 className="text-3xl font-bold my-4">{children}</h1>;
          }
        },
        h2: ({ children }) => (
          <h2 className={`text-2xl font-bold mt-6 mb-3 ${themeStyles[theme].h2}`}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className={`text-xl font-semibold mt-4 mb-2 ${themeStyles[theme].h3}`}>{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className={`my-3 p-4 ${themeStyles[theme].blockquote}`}>{children}</blockquote>
        ),
        p: ({ children }) => (
          <p className="my-2">{children}</p>
        ),
        hr: () => (
          <hr className="my-3 border-t dark:border-gray-700" />
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className={themeStyles[theme].table.header}>{children}</thead>
        ),
        tr: ({ children }) => (
          <tr className={themeStyles[theme].table.row}>{children}</tr>
        ),
        th: ({ children }) => (
          <th className={`py-2 px-4 text-left font-semibold border ${themeStyles[theme].table.cell}`}>{children}</th>
        ),
        td: ({ children }) => (
          <td className={`py-2 px-4 border ${themeStyles[theme].table.cell}`}>{children}</td>
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {processedMarkdown}
    </ReactMarkdown>
  );
};