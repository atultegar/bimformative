"use client";
import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useState } from 'react';
import { CheckmarkIcon, CopyIcon } from '@sanity/icons';

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
    <div className="relative bg-gray-900 text-white rounded-lg overflow-hidden my-4 shadow-lg">
      {/* Language Label */}
      <span className="absolute top-2 left-4 bg-blue-500 text-xs font-semibold uppercase px-2 py-1 rounded-md">
        {language}
      </span>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-4 text-gray-300 hover:text-white transition flex items-center"
      >
        {isCopied ? <CheckmarkIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />} <span className='px-1 text-sm'>Copy code</span>
      </button>

      {/* Syntax Highlighting */}
      <Highlight code={code.trim()} language={language} theme={themes.dracula}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="mt-10 p-4 overflow-auto text-sm leading-relaxed"
            style={{ ...style, backgroundColor: 'transparent' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
