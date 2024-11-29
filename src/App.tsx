import React, { useState, useEffect } from 'react';
import { Download, Share, FileText } from 'lucide-react';
import { ThemeSelector, type Theme } from './components/ThemeSelector';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { exportToPDF } from './utils/pdfExport';
import { exportToDocx } from './utils/docxExport';

const initialMarkdown = `# Welcome to Markdown Editor

## Features
- Multiple beautiful themes
- Live preview
- PDF export
- Dark mode
- Share functionality

### Try it out!
Start typing in the editor to see the magic happen...`;

function App() {
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem('markdown');
    return saved || initialMarkdown;
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'modern';
  });

  const [singlePage, setSinglePage] = useState(false);

  useEffect(() => {
    localStorage.setItem('markdown', markdown);
    localStorage.setItem('darkMode', String(darkMode));
    localStorage.setItem('theme', theme);
  }, [markdown, darkMode, theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedContent = urlParams.get('content');
    if (sharedContent) {
      setMarkdown(decodeURIComponent(sharedContent));
    }
  }, []);

  const handleShare = async () => {
    try {
      const content = encodeURIComponent(markdown);
      const url = `${window.location.origin}?content=${content}`;
      await navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to create share link:', err);
      alert('Failed to create share link');
    }
  };

  const handleSavePDF = () => {
    const element = document.querySelector('.preview-content');
    if (!element) return;
    exportToPDF(element as HTMLElement, singlePage);
  };

  const handleSaveDocx = () => {
    exportToDocx(markdown, theme);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <ThemeSelector theme={theme} onChange={setTheme} darkMode={darkMode} />
            <label className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <input
                type="checkbox"
                checked={singlePage}
                onChange={(e) => setSinglePage(e.target.checked)}
                className="rounded"
              />
              Single page PDF
            </label>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleSavePDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              Save PDF
            </button>

            <button
              onClick={handleSaveDocx}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText size={20} />
              Save DOCX
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Share size={20} />
              Share
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[800px] print:hidden">
            <textarea
              className={`w-full h-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono ${
                darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border-gray-200'
              }`}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here..."
            />
          </div>
          
          <div className={`preview-content rounded-lg shadow-sm p-8 border min-h-[800px] prose prose-lg max-w-none ${
            darkMode ? 'bg-gray-800 text-gray-100 border-gray-700 prose-invert' : 'bg-white text-gray-800 border-gray-200'
          }`}>
            <MarkdownRenderer
              markdown={markdown}
              darkMode={darkMode}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;