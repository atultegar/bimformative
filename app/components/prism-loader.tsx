"use client"

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-python";

export default function PrismLoader() {
    useEffect(() => {
        Prism.highlightAll();        
    }, []);
    return <div className="hidden"></div>
}