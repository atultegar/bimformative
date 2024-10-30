import Image from "next/image";
import square from "../../public/square.svg";
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
import twitter from "../../public/twitter.svg";
import insta from "../../public/insta.svg";
import linkedin from "../../public/linkedin.svg";
import { Button } from "@/components/ui/button";
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
        id: 1,
        icon: instagramIcon,
        name: "Instagram",
        username: "@chaosatul",
        link: "https://www.instagram.com/chaosatul/"
    },
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
            <div className="flex flex-col w-full col-span-1 lg:col-span-2 gap-4">
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

                {/* <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-4">
                    {socialMedia.map((item) => (
                        <Card key={item.id}
                        className="p-4 flex flex-col items-center sm:items-start bg-gray-100 border-none">
                            <Image src={item.icon} alt="Icon" className="w-16 h-16" />
                            <h1 className="text-2xl font-medium pt-3">{item.name}</h1>
                            <p className="text-muted-foreground">{item.username}</p>
                            <Button className="mt-4 " size="sm" asChild>
                                <a href={item.link}>Follow</a>
                            </Button>
                        </Card>
                    ))}
                </div> */}
            </div>
        </div>
    )
}