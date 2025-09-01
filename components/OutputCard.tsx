
import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons';

interface OutputCardProps {
  title: string;
  children: React.ReactNode;
  isLoading: boolean;
  copyText?: string;
}

const OutputCard: React.FC<OutputCardProps> = ({ title, children, isLoading, copyText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyText) {
      navigator.clipboard.writeText(copyText);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 transition-all duration-300">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {copyText && (
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isLoading || !copyText}
          >
            {copied ? 'Đã chép!' : <CopyIcon />}
          </button>
        )}
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="bg-gray-200 h-4 w-full rounded animate-pulse"></div>
            <div className="bg-gray-200 h-4 w-5/6 rounded animate-pulse"></div>
            <div className="bg-gray-200 h-4 w-3/4 rounded animate-pulse"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default OutputCard;
