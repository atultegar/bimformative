"use client";

import { useEffect, useState } from "react";
import TagMenu from "./TagMenu";

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10;

    // const router = useRouter();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`api/blogs?search=${searchTerm}&page=${page}&limit=${limit}`);
                const data = await response.json();
                setBlogs(data.blogs);
                setTotalPages(Math.ceil(data.totalCount / limit));
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }        
        };

        const fetchTags = async () => {
            try {
                // Fetch tags
                const allTagsResponse = await fetch(`/api/blogs/tags`);
                const allTagsData = await allTagsResponse.json();

                if (!allTagsResponse.ok) throw new Error(allTagsData.error || "Failed to fetch tags");

                setAllTags(allTagsData);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchBlogs();
        fetchTags();
    }, [searchTerm, page]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setPage(1); // Reset to first page for new search
            setSearchTerm((e.target as HTMLInputElement).value);
        }
    };

    return (
        <div>
            <TagMenu allTags={allTags} />
        </div>
    );
};