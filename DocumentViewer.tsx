
import React from 'react';
import { X, Building, Calendar, Tag, FileText } from 'lucide-react';
import { PolicyDocument } from './policy_data.ts';

interface DocumentViewerProps {
  document: PolicyDocument | null;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  if (!document) return null;

  const renderFullText = (text: string) => {
    const pages = text.split(/==End of OCR for page \d+==\s*/);
    return pages
      .map(pageContent => pageContent.replace(/==Start of OCR for page \d+==\s*/, '').trim())
      .filter(cleanContent => cleanContent) // Remove empty pages
      .map((cleanContent, index) => (
        <div key={index} className="mb-8 border-b-2 border-dashed border-gray-300 dark:border-gray-700 pb-8 last:border-b-0 last:pb-0">
          <div className="text-center mb-4 text-sm font-mono text-gray-500 dark:text-gray-500">[ Page {index + 1} ]</div>
          <div className="whitespace-pre-wrap font-sans text-gray-700 dark:text-c42-text-dark-secondary leading-relaxed">
            {cleanContent}
          </div>
        </div>
      ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-c42-dark-card rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-c42-primary" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-c42-text-dark-primary">
              {document.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            aria-label="Close document viewer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-c42-text-dark-secondary">
               <span className="flex items-center gap-2"><Building className="w-4 h-4 text-c42-secondary" /> {document.source}</span>
               <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-c42-secondary" /> {new Date(document.datePublished).getFullYear()}</span>
               <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-c42-secondary" /> {document.type}</span>
            </div>
             <div className="flex flex-wrap gap-2 mt-4">
                {document.keyTopics.map((topic, i) => (
                   <span key={i} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">{topic}</span>
                ))}
              </div>
          </div>

          {document.fullText ? (
            renderFullText(document.fullText)
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <h4 className="font-semibold text-gray-900 dark:text-c42-text-dark-primary text-lg">AI Summary</h4>
              <p className="text-gray-700 dark:text-c42-text-dark-secondary mt-2">{document.aiAnalysis.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
