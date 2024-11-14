"use client";
import { useState } from 'react';
import { CheckmarkIcon, CopyIcon } from '@sanity/icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { docco, dracula, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Copy code to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      {/* Language Label */}
      <span className="absolute top-2 left-4 bg-blue-500 text-xs font-semibold px-2 py-1 mb-5 rounded-sm">
        {language}
      </span>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-4 text-gray-300 hover:text-white transition flex items-center">
        {isCopied ? <CheckmarkIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
      </button>

      <SyntaxHighlighter language={language} style={atomOneDark} showLineNumbers={true} className="mt-10">
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
