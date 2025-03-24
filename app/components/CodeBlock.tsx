"use client";
import { useState } from 'react';
import { CheckmarkIcon, CopyIcon } from '@sanity/icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { PiFilePy, PiFileCSharp, PiFileJs, PiFileTs  } from "react-icons/pi";
import { Circle } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  title: string;
}

// Language to icon mapping
const languageIcons: Record<string, JSX.Element> = {
  python: <PiFilePy className="text-gray-500" size={24} />,
  csharp: <PiFileCSharp className="text-gray-500" size={24} />,
  javascript: <PiFileJs className="text-gray-500" size={24} />,
  typescript: <PiFileTs className="text-gray-500" size={24} />,
};

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Copy code to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="flex flex-col bg-sky-950 rounded-xl mx-auto shadow-inner shadow-slate-600">
      <div className='flex items-center justify-between gap-2 px-3 mt-2'>
        {/* Style */}
        <span className="flex flex-row gap-1.5">
          <Circle className='w-3 h-3' fill='#FF5F56' stroke='#FF5F56' strokeWidth="4"/>
          <Circle className='w-3 h-3' fill='#FFBD2E' stroke='#FFBD2E' strokeWidth="4"/>
          <Circle className='w-3 h-3' fill='#27C93F' stroke='#27C93F' strokeWidth="4"/>
        </span>

        {/* Language Icon */}
        <span className="flex items-center gap-1">
          {languageIcons[language.toLowerCase()] || (
            <span className="text-xs font-semibold text-gray-500">?</span>
          )}
          <span className='text-gray-200'>{title}</span>
        </span>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="text-gray-300 hover:text-white transition flex items-center">
          {isCopied ? <CheckmarkIcon className="w-5 h-5"/> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>     

      {/* Code Container with Scrollbars */}
      <div className='mt-2 max-h-[80vh] max-w-full mb-0 overflow-auto shadow shadow-slate-600'>
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
