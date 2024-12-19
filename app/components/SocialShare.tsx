"use client";

import React from "react";
import {FacebookShare} from "react-share-lite";
import { FaRegShareFromSquare, FaLinkedin, FaFacebook } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export default function SocialShare({ url, title }) {
    return (
        
        <div className="flex space-x-4 mt-4">
            <Button variant="ghost">
                <FaRegShareFromSquare />            
            </Button>
            {/* Facebook */}
            <FacebookShare url={url} quote={title} size={24}>
            </FacebookShare>
        </div>
    )
}