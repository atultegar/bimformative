import { Charm } from "next/font/google";
import React from "react";

const charm = Charm({ weight: "700", subsets: ["latin"]});

export default function AboutSection() {
    return (
        <section className="max-w-full mx-auto h-auto sm:h-[500px] mt-10 py-10 text-left flex flex-col justify-center items-center">
            {/* <h2 className="text-3xl font-semibold">About BIMformative</h2> */}
            <div className="px-5 sm:px-10 text-2xl sm:text-4xl font-semibold max-w-6xl mx-auto flex flex-col justify-center items-center">
            <p className="text-left">
            <span className="text-gray-400">BIMformative is dedicated to</span> empowering infrastructure professionals <span className="text-gray-400">through a rich collection of</span> tutorials, scripts, and resources.
            </p>
            <p className="mt-5 text-left">
            <span className="text-gray-400">Our goal is to</span> streamline <span className="text-gray-400">your journey in</span> mastering <span className="text-gray-400">Building Information Modeling (BIM) for Infrastructure.</span>
            </p>
            </div>
        </section>
    )
}