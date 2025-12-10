import React from 'react';
import { Copy, Terminal } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  title: string;
  isLoading: boolean;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, title, isLoading }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Terminal size={16} className="text-indigo-400" />
          <span className="font-mono text-sm font-semibold text-slate-200">{title}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-xs flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
        >
          <Copy size={14} />
          <span>Copy</span>
        </button>
      </div>
      
      <div className="relative flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <pre className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-all">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodeViewer;