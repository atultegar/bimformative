"use client";
import { useState } from 'react';
import { CheckmarkIcon, CopyIcon } from '@sanity/icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { PiFilePy, PiFileCSharp, PiFileJs, PiFileTs  } from "react-icons/pi";

interface CodeBlockProps {
  code: string;
  language: string;
}

// Language to icon mapping
const languageIcons: Record<string, JSX.Element> = {
  python: <PiFilePy className="text-gray-500" size={24} />,
  csharp: <PiFileCSharp className="text-gray-500" size={24} />,
  javascript: <PiFileJs className="text-gray-500" size={24} />,
  typescript: <PiFileTs className="text-gray-500" size={24} />,
};

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Copy code to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="relative bg-gray-900 rounded-lg mx-auto p-4">
      {/* Language Icon */}
      <span className="absolute top-2 left-4">
        {languageIcons[language.toLowerCase()] || (
          <span className="text-xs font-semibold text-gray-500">?</span>
        )}
      </span>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-4 text-gray-300 hover:text-white transition flex items-center">
        {isCopied ? <CheckmarkIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
      </button>

      {/* Code Container with Scrollbars */}
      <div className='mt-5 max-h-[80vh] max-w-[1070px] mb-0 overflow-auto'>
        <SyntaxHighlighter 
          language={language} 
          style={atomOneDark} 
          showLineNumbers={true} 
          customStyle={{
            width: "100%",
            maxWidth: "100%",
          }}>
            {code}
        </SyntaxHighlighter>
      </div>      
    </div>
  );
};
