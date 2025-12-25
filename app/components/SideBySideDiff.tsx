"use client";

import React, { useMemo } from "react";
import { diffLines } from "diff";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface SideBySideDiffProps {
    oldValue: string;
    newValue: string;
    language?: string;
    title?: string;
    darkMode?: boolean;
}

export default function SideBySideDiff({
    oldValue,
    newValue,
    language = "python",
    title,
    darkMode = false,
}: SideBySideDiffProps) {
    const diff = useMemo(() => diffLines(oldValue ?? "", newValue ?? ""), [oldValue, newValue]);

    // Build left + right column line-by-line maps
    const leftLines: string[] = [];
    const leftTypes: ("added" | "removed" | "same" | "blank")[] = [];

    const rightLines: string[] = [];
    const rightTypes: ("added" | "removed" | "same" | "blank")[] = [];

    diff.forEach((part) => {
        let lines = part.value.split("\n");

        // Remove only the last line if it's empty
        if (lines.length > 1 && lines[lines.length - 1].trim() === "") {
            lines = lines.slice(0, -1);
        }        

        if (part.added) {
            // Right column only
            lines.forEach((l) => {
                rightLines.push(l);
                rightTypes.push("added");

                leftLines.push("");
                leftTypes.push("blank");
            });
        } else if (part.removed) {
            // Left column only
            lines.forEach((l) => {
                leftLines.push(l);
                leftTypes.push("removed")

                rightLines.push("");
                rightTypes.push("blank");
            })
        } else {
            // Both sides (unchanged)
            lines.forEach((l) => {
                leftLines.push(l);
                leftTypes.push("same");

                rightLines.push(l);
                rightTypes.push("same");
            });
        }
    });

    const maxLines = Math.max(leftLines.length, rightLines.length);
    let j: number = 0;
    let k: number = 0;

    return (
        <div className="border rounded-md overflow-hidden">
            {title && (
                <div className="px-4 py-2 text-sm border-b bg-gray-100 dark:bg-neutral-800">
                    {title}
                </div>
            )}

            <div className="grid grid-cols-2 divide-x divide-black/10 dark:divide-white/10 text-sm">

                {/* LEFT SIDE */}
                <div>                    
                    {Array.from({ length: maxLines }).map((_, i) => {                           
                        const value = leftLines[i] ?? "";
                        const type = leftTypes[i];
                        j = value ? j + 1 : j;
                        const bg = 
                            type === "removed"
                            ? "bg-red-100 dark:bg-red-900/40"
                            : type === "same"
                            ? "bg-transparent"
                            : "bg-gray-700/10";

                        const bgLn = 
                            type === "removed"
                            ? "bg-red-100 dark:bg-red-900/40"
                            : type === "same"
                            ? "bg-transparent"
                            : "bg-transparent";

                        return (
                            <div
                                key={`left-${i}`}
                                className={`grid grid-cols-[50px_1fr] ${bg}`}
                            >
                                {/* Line Number */}
                                <div className={`px-4 py-1 text-xs text-gray-500 dark:text-gray-400 ${bgLn}`}>
                                    {value ? j : ""}
                                </div>

                                {/* Code */}
                                <SyntaxHighlighter
                                    language={language}
                                    style={darkMode ? atomOneDark : oneLight}
                                    customStyle={{
                                        margin: 0,
                                        padding: "2px 4px",
                                        background: "transparent",
                                    }}     
                                >
                                    {value || " "}
                                </SyntaxHighlighter>

                            </div>
                        );
                    })}
                </div>

                {/* RIGHT SIDE */}
                <div>
                    {Array.from({ length: maxLines }).map((_, i) => {
                        const value = rightLines[i] ?? "";
                        const type = rightTypes[i];
                        k = value ? k + 1 : k;
                        const bg = 
                            type === "added"
                            ? "bg-green-100 dark:bg-green-900/40"
                            : type === "same"
                            ? "bg-transparent"
                            : "bg-gray-700/10";

                        const bgLn = 
                            type === "added"
                            ? "bg-green-100 dark:bg-green-900/40"
                            : type === "same"
                            ? "bg-transparent"
                            : "bg-transparent";

                        return (
                            <div
                                key={`right-${i}`}
                                className={`grid grid-cols-[50px_1fr] ${bg}`}
                            >
                                {/* Line Number */}
                                <div className={`px-4 py-1 text-xs text-gray-500 dark:text-gray-400 ${bgLn}`}>
                                    {value ? k : ""}
                                </div>

                                {/* Code */}
                                <SyntaxHighlighter
                                    language={language}
                                    style={darkMode ? atomOneDark : oneLight}
                                    customStyle={{
                                        margin: 0,
                                        padding: "2px 4px",
                                        background: "transparent",
                                    }}     
                                >
                                    {value || " "}
                                </SyntaxHighlighter>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}