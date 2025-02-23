import React from "react";
import profilePic from "@/public/profile-pic.png";
import Image from "next/image";

export default function MeetTheDeveloper() {
    return (
        <section className="relative bg-gray-50 dark:bg-gray-900 py-12 px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold text-blue-600 dark:text-blue-400">
                    Meet the Mind Behind
                </h2>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100">BIMformative</h2>
                <div className="flex flex-row items-center justify-center mt-2">                    
                    <p className="text-xl sm:text-xl lg:text-2xl font-semibold tracking-wide mt-5 text-center scroll-m-20">
                        I&apos;m Atul Tegar, a self-taught BIM developer and problem solver at heart. Over the years, I&apos;ve dedicated myself to tackling the unique challenges
                        of BIM for Infrastructure. From designing cutting-edge Dynamo scripts to developing custom add-ins, Dynamo packages, my goals has been to simplify workflows
                        and enhance productivity. <br />
                        <br />
                        This website - and everything on it - was created by me, fueled by countless hours of learning, coding, and passion. I built this platform from scratch using
                        online resources, turning a vision into reality.
                    </p>
                    <Image src={profilePic} alt="Atul Tegar" className="rounded-full mt-2 mx-auto" width={300} height={300} />
                    
                </div>
            </div>
        </section>
    )
}