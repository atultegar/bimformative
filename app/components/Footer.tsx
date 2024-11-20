"use client"

import Link from "next/link";
import { navigationItems } from "./Navbar";
import { socialMedia } from "./SectionTwo";
import Image from "next/image";
import logo from "../../public/logo-1.png"
import darklogo from "../../public/logo-2.png"

// export function Footer() {
//     return (
//         <footer className="my-12">
//             <ul className="flex flex-wrap justify-center">
//                 {navigationItems.map((item, index) =>(
//                     <div key={index} className="px-5 py-2">
//                         <Link href={item.href} className="text-muted-foreground">
//                             {item.name}
//                         </Link>
//                     </div>
//                 ))}
//             </ul>

//             <p className="mt-2 text-center text-muted-foreground">
//                 &copy; 2024 BIMformative. All Rights reserved.
//             </p>
//         </footer>
//     )
// }

export function Footer() {
    return (
        <footer className="relative w-full mb-2 mt-5">
            <div className="w-full px-8 mx-auto max-w-7xl py-5">
                <div className="grid justify-between grid-cols-1 gap-4 md:grid-cols-2 border-t border-gray-300 dark:border-stone-600">
                    <h5 className="mb-2 text-xl font-semibold text-primary py-2 flex flex-wrap gap-2">
                        <Image src={logo} alt="logo" className="w-8 h-8 block dark:hidden"/>
                        <Image src={darklogo} alt="darklogo" className="w-8 h-8 hidden dark:block"/>
                        BIMformative
                    </h5>
                    <div className="grid justify-between grid-cols-3 gap-4 py-2">
                        <ul className="lg:mb-5 flex flex-wrap">
                            <p className="block mb-1 text-base font-semibold text-primary">
                                Quick Links
                            </p>
                            <li className="lg:inline-flex">
                                {navigationItems.map((item, index) => (
                                    <div key={index} className="py-2">
                                        <Link href={item.href} className="block text-slate-600 py-1 hover:text-primary focus:text-slate-500 text-sm mr-12">
                                            {item.name}
                                        </Link>
                                    </div>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full py-4 mt-8 border-t border-gray-300 dark:border-stone-600 md:flex-row md:justify-between">
                    <p className="block text-sm text-center text-slate-500 md:mb-0">
                        Copyright &copy; {new Date().getFullYear()} BIMformative. All rights reserved.
                    </p>
                    <div className=" flex sm:flex mb-2 gap-2 text-slate-600 dark:text-slate-300 sm:justify-center">
                        {socialMedia.map((item, index)=> (
                            <div key={index}>
                                <Link href={item.link} className="block transition-opacity text-inherit hover:opacity-80 opacity-50">
                                    <Image src={item.icon} alt="Icon" className="w-5 h-5 dark:invert"/>
                                </Link>
                            </div>
                        ))}                                
                    </div>
                </div>
            </div>
        </footer>
    )
}