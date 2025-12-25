"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface NodeValueDiffProps {
    oldValue: string;
    newValue: string;
    language?: string;
    title?: string;
    darkMode?: boolean;
}

export default function NodeValueDiff({
    oldValue,
    newValue,
    language = "python",
    title,
    darkMode = false
}: NodeValueDiffProps) {
    const oldLines = oldValue?.split("\n") ?? [];
    const newLines = newValue?.split("\n") ?? [];

    const maxLines = Math.max(oldLines.length, newLines.length);

    return (
        <div className="border rounded-md overflow-hidden">
            {title && (
                <div className="px-4 py-2 text-sm border-b bg-gray-100 dark:bg-neutral-800">
                    {title}
                </div>
            )}            

            {/* Diff Rows */}
            {Array.from({ length: maxLines }).map((_, index) => {
                const oldLine = oldLines[index] || "";
                const newLine = newLines[index] || "";
                const changed = oldLine !== newLine;

                return (
                    <div
                        key={index}
                        className="grid grid-cols-2 border-b border-gray-200 dark:border-neutral-800"
                    >
                        {/* OLD */}
                        <div className={`border-r ${
                            changed ? "bg-red-100 dark:bg-red-900/40" : "bg-transparent"
                            }`}
                        >
                            <SyntaxHighlighter
                                language={language}
                                style={darkMode ? oneDark : oneLight}
                                customStyle={{
                                    margin: 0,
                                    padding: "6px 10px",
                                    background: "transparent",
                                }}
                            >
                                {oldLine || " "}
                            </SyntaxHighlighter>
                        </div>

                        {/* NEW */}
                        <div className={`border-r ${
                            changed ? "bg-green-100 dark:bg-green-900/40" : "bg-transparent"
                            }`}
                        >
                            <SyntaxHighlighter
                                language={language}
                                style={darkMode ? oneDark : oneLight}
                                customStyle={{
                                    margin: 0,
                                    padding: "6px 10px",
                                    background: "transparent",
                                }}
                            >
                                {newLine || " "}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}