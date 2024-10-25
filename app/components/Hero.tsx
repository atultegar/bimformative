import Image from "next/image";

import profileImage from "../../public/hero.jpg"

export function Hero() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-1 lg:col-span-2 h-full bg-gray-100 min-h-[500px] lg:min-h-[300px] rounded-2xl p-8">
                <h1 className="text-4xl lg:text-6xl font-medium">
                    BIMformative 
                </h1>
                <h1 className="text-2xl lg:text-4xl font-normal mt-3">
                    Where Infrastructure Innovation Takes Shape
                </h1>
                <p className="mt-4">
                    BIMFormative is a comprehensive platform designed to share insightful blogs, detailed documentation, and expert manuals on BIM for Infrastructure. It serves as a knowledge hub for engineers, architects, project managers, and BIM enthusiasts looking to enhance their skills and stay updated on industry trends. With a focus on the formative aspects of BIM, this website provides tools, tutorials, and guidance necessary for driving innovation and efficiency in infrastructure projects through advanced BIM practices. Whether you're a beginner seeking foundational understanding or a professional looking for in-depth analysis, BIMFormative equips you with the resources to shape your BIM expertise.
                </p>
            </div>
            <Image
                src={profileImage}
                alt="Profile"
            className="col-span-1 h-[500px] object-cover rounded-2xl bg-gray-100"
            priority
        />
        </div>
    )
}