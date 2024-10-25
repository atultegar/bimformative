"use client"

import Link from "next/link";
import { navigationItems } from "./Navbar";
import { socialMedia } from "./SectionTwo";
import Image from "next/image";
import logo from "../../public/tunnel-100.png"

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
                <div className="grid justify-between grid-cols-1 gap-4 md:grid-cols-2 border-t border-slate-200">
                    <h5 className="mb-2 text-xl font-semibold text-primary py-2 flex flex-wrap">
                        <Image src={logo} alt="logo" className="w-8 h-8"/>
                        BIMformative
                    </h5>
                    <div className="grid justify-between grid-cols-3 gap-4 py-2">
                        <ul>
                            <p className="block mb-1 text-base font-semibold text-primary">
                                Quick Links
                            </p>
                            <li>
                                {navigationItems.map((item, index) => (
                                    <div key={index}>
                                        <Link href={item.href} className="block text-slate-600 py-1 hover:text-slate-500 focus:text-slate-500 text-sm">
                                            {item.name}
                                        </Link>
                                    </div>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full py-4 mt-8 border-t border-slate-200 md:flex-row md:justify-between">
                    <p className="block mb-2 text-sm text-center text-slate-500 md:mb-0">
                        Copyright &copy; {new Date().getFullYear()} BIMformative. All rights reserved.
                    </p>
                    <div className=" flex gap-4 text-slate-600 sm:justify-center">
                        {socialMedia.map((item, index)=> (
                            <div key={index}>
                                <Link href={item.link} className="block transition-opacity text-inherit hover:opacity-80">
                                    <Image src={item.icon} alt="Icon" className="w-8 h-8"/>
                                </Link>
                            </div>
                        ))}                                
                    </div>
                </div>
            </div>
        </footer>
    )
}