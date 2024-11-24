"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NotificationBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="w-full bg-primary-foreground text-center text-black py-2 text-xs sm:text-sm font-medium relative">
            <span>
                🚧 This website is currently under development, and some features may not work as expected. 🚧
            </span>
            <Button variant="ghost" onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black font-bold">
                    X
            </Button>
        </div>
    );
}