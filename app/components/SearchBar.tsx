import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
    placeholder?: string;
    buttonText?: string;
    className?: string;
}

export default function SearchBar({ 
    placeholder = "Find the BIM resource you need...", 
    buttonText = "Search", 
    className = "",
    }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${searchQuery}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            router.push(`/search?q=${searchQuery}`);
        }
    };

    return (
        <form className={`relative flex w-full max-w-sm sm:max-w-md items-center justify-center space-x-2 dark:border-gray-500 rounded-2xl hover:border-gray-900 bg-white dark:bg-gray-950 p-1 dark:hover:border-blue-800 ${className}`}
        onSubmit={handleSubmit}
        >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-6 h-6 text-gray-500" />
            </span>
            <Input
                type="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 border-none focus:outline-none focus:ring-0 bg-transparent text-gray-500"
            />
            <Button type="submit" variant="default" className="p-2 rounded-xl w-24">
                {buttonText}
            </Button>
        </form>
    );
}