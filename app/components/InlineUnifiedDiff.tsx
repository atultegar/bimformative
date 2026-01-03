"use client";

import React, { useMemo } from "react";
import { diffLines } from "diff";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface InlineUnifiedDiffProps {
    oldValue: string;
    newValue: string;
    language?: string;
    title?: string;
    darkMode?: boolean;
}

export default function InlineUnifiedDiff({
    oldValue,
    newValue,
    language = "python",
    title,
    darkMode = false
} : InlineUnifiedDiffProps) {

    const diff = useMemo(() => diffLines(oldValue ?? "", newValue ?? ""), [
        oldValue,
        newValue,
    ]);

    return (
        <div className="border rounded-md overflow-hidden">
            { title && (
                <div className="px-4 py-2 font-medium border-b bg-gray-100 dark:bg-neutral-800">
                    {title}
                </div>
            )}

            <div className="text-sm">
                {diff.map((part, index) => {
                    const { added, removed, value } = part;

                    const bg = added
                    ? "bg-green-100 dark:bg-green-900/40"
                    : removed
                    ? "bg-red-100 dark:bg-red-900/40"
                    : "bg-transparent";

                    const prefix = added ? "+" : removed ? "-" : " ";

                    return (
                        <div
                            key={index}
                            className={`${bg} border-b border-black/5 dark:border-white/10`}
                        >
                            <SyntaxHighlighter
                                language={language}
                                style={darkMode ? oneDark : oneLight}
                                customStyle={{
                                    margin: 0,
                                    padding: "6px 12px",
                                    background: "transparent",
                                    whiteSpace: "pre-wrap",
                                }}
                                wrapLines={true}
                                lineProps={() => ({
                                    style: { display: "block" }
                                })}                            
                            >
                                {/* Prefix added for GitHub-like diff */}
                                {value
                                    .split("\n")
                                    .map((line) => (line.trim().length ? `${prefix}${line}`: line))
                                    .join("\n")}
                            </SyntaxHighlighter>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}