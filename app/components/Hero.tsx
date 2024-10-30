import Image from "next/image";

import profileImage from "../../public/intro.png"

export function Hero() {
    return (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="col-span-1 lg:col-span-1 h-full bg-gray-100 dark:bg-black min-h-[500px] lg:min-h-[300px] rounded-2xl p-8 flex flex-col justify-center">
                <h1 className="text-4xl lg:text-6xl font-bold">
                    BIM<span className="italic">formative</span>
                </h1>
                <h1 className="text-2xl lg:text-6xl font-bold mt-3 bg-gradient-to-r from-blue-300 to-pink-300 inline-block text-transparent bg-clip-text">
                    Where infrastructure innovation takes shape.
                </h1>
                <p className="mt-4 text-gray-400">
                    Blogs, Tutorials, Documentation, Resources
                </p>
                {/* <p className="mt-4">
                    BIMFormative is a comprehensive platform designed to share insightful blogs, detailed documentation, and expert manuals on BIM for Infrastructure. It serves as a knowledge hub for engineers, architects, project managers, and BIM enthusiasts looking to enhance their skills and stay updated on industry trends. With a focus on the formative aspects of BIM, this website provides tools, tutorials, and guidance necessary for driving innovation and efficiency in infrastructure projects through advanced BIM practices. Whether you're a beginner seeking foundational understanding or a professional looking for in-depth analysis, BIMFormative equips you with the resources to shape your BIM expertise.
                </p> */}
            </div>
            {/* <Video src={introVideo} /> */}

            <Image
                src={profileImage}
                alt="Profile"
            className="col-span-1 h-[400px] object-cover rounded-2xl bg-gray-100"
            priority />
        </div>
    )
}