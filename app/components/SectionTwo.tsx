import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import bimsoftwares from "@/public/bim-software-1024x512.webp"
import autocad from "@/public/bim-icons/autocad.png";
import revit from "@/public/bim-icons/revit.png";
import civil3d from "@/public/bim-icons/civil3d.png";
import dynamo from "@/public/bim-icons/dynamo.png";
import inventor from "@/public/bim-icons/inventor.png";
import navisworks from "@/public/bim-icons/navisworks.png";
import bim360 from "@/public/bim-icons/bim360.png";
import python from "@/public/bim-icons/pythonLogo.png";
import csharp from "@/public/bim-icons/csharpLogo2023.png";
import vb from "@/public/bim-icons/vb.png";

import githubIcon from "@/public/social-media/github.svg";
import youtubeIcon from "@/public/social-media/youtube-dark.svg";
import linkedinIcon from "@/public/social-media/linkedin.svg";
import xIcon from "@/public/social-media/x.svg";
import emailIcon from "@/public/social-media/gmail.svg";

const icons = [
    autocad,
    revit,
    civil3d,
    dynamo,
    inventor,
    navisworks,
    bim360,
    python,
    csharp,
    vb,
];

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

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
        username: contactEmail,
        link: `mailto:${contactEmail}`        
    },

]

export function SectionTwo() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10">
            <div className="w-full relative col-span-1">
                <Image
                src={bimsoftwares}
                alt="bimsoftwares"
                className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex flex-col w-full h-full col-span-1 lg:col-span-2 gap-4">
                <Card className="bg-gray-100 dark:bg-black border-none">
                    <CardHeader>
                        <CardTitle>Explore our stack</CardTitle>
                        <CardDescription>Check out the tool we use daily</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4 justify-center mx-auto">
                        {icons.map((item, index) => (
                            <Image key={index} src={item} alt='Icon' className="w-20 h-20 rounded-lg shadow text-center dark:shadow-stone-950" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}