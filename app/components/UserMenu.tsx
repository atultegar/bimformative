"use client";
import { LayoutDashboard, ToyBrick, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function UserMenu() {
    return (
        <UserButton>
            <UserButton.MenuItems>
                <UserButton.Link 
                    label="Dashboard"
                    labelIcon = {<LayoutDashboard className="w-4 h-4"/>}                    
                    href="/dashboard" />
                <UserButton.Link 
                    label="Search"
                    labelIcon = {<Search className="w-4 h-4"/>}                    
                    href="/search" />
            </UserButton.MenuItems>
        </UserButton>        
    )
}