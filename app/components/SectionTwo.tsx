import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import bimsoftwares from "../../public/bim-software-1024x512.webp"
import canva from "../../public/tech-icons/canva.svg";
import chatgpt from "../../public/tech-icons/chatgpt.svg";
import github from "../../public/tech-icons/github.svg";
import youtube from "../../public/tech-icons/youtube.svg";
import chrome from "../../public/tech-icons/chrome.svg";
import notion from "../../public/tech-icons/notion.svg";
import autocad from "../../public/tech-icons/autocad.svg";
import revit from "../../public/tech-icons/revit_grande.svg";

import githubIcon from "../../public/square-github-brands-solid.svg";
import youtubeIcon from "../../public/youtube-brands-solid.svg";
import linkedinIcon from "../../public/linkedin-brands-solid.svg";
import instagramIcon from "../../public/square-instagram-brands-solid.svg";
import xIcon from "../../public/square-x-twitter-brands-solid.svg";
import emailIcon from "../../public/envelope-solid.svg";

const icons = [
    autocad,
    revit,
    canva,
    chatgpt,
    github,
    youtube,
    chrome,
    notion,    
];

export const socialMedia = [    
    {
        id: 2,
        icon: xIcon,
        name: "X / Twitter",
        username: "@chaos_atul",
        link: "https://x.com/chaos_atul"
    },
    {
        id: 3,
        icon: linkedinIcon,
        name: "LinkedIn",
        username: "atultegar",
        link: "https://www.linkedin.com/in/atultegar/"
    },
    {
        id: 4,
        icon: youtubeIcon,
        name: "YouTube",
        username: "@atultegar444",
        link: "https://www.youtube.com/@atultegar444"
    },
    {
        id: 5,
        icon: githubIcon,
        name: "GitHub",
        username: "atultegar",
        link: "https://github.com/atultegar"
    },
    {
        id: 6,
        icon: emailIcon,
        name: "Email",
        username: "atul.tegar@gmail.com",
        link: "mailto:atul.tegar@gmail.com"
    },

]


export function SectionTwo() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10">
            <div className="w-full relative col-span-1">
                <Image
                src={bimsoftwares}
                alt="bimsoftwares"
                className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="flex flex-col w-full h-full col-span-1 lg:col-span-2 gap-4">
                <Card className="bg-gray-100 dark:bg-black border-none">
                    <CardHeader>
                        <CardTitle>Explore our stack</CardTitle>
                        <CardDescription>Check out the tool we use daily</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        {icons.map((item, index) => (
                            <Image key={index} src={item} alt='Icon' className="w-16 h-16" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}