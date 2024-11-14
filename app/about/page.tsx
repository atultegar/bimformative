import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About"
}

export default function AboutPage() {
    return (
        <div className="max-w-7xl w-full px-4 md:px-8 mx-auto" >
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-100 dark:bg-black rounded-xl lg:h-[400px]">
                {/* Heading Section */}
                <div className="col-span-1 lg:col-span-2 p-4 lg:p-8 mx-10">
                    <h1 className="text-4xl sm:text-4xl lg:text-6xl text-center lg:text-left font-extrabold scroll-m-20 tracking-tight">
                        Welcome to BIM<span className="italic">formative</span>
                    </h1>                    
                </div>
                <div className="lg:col-start-2 h-auto lg:h-[150px] px-4 mb-5 lg:mb-0">
                    <h2 className="text-xl sm:text-xl lg:text-xl font-semibold tracking-wide mt-5 lg:mt-5 text-center lg:text-right scroll-m-20 lg:mr-5">
                        Your trusted resource for insights, documentation, and technical guidance on Building Information Modeling (BIM) for Infrastructure.
                    </h2>
                </div>
                
            </div>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-100 dark:bg-black rounded-xl lg:h-[400px] items-center">
                <div className="lg:col-start-1 lg:col-span-2 h-auto lg:h-[200px] px-4">
                    <h2 className="text-2xl sm:text-xl lg:text-2xl font-semibold tracking-wide mt-5 text-center scroll-m-20 ">
                        Our mission is to empower infrastructure professionals, architects, engineers, and construction specialists to harness the power of BIM for more efficient, accurate, and collaborative project outcomes.
                    </h2>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-100 dark:bg-black rounded-xl lg:h-[400px] items-center">
                <div className="lg:col-start-1 h-auto lg:h-[200px] p-4 flex flex-col justify-center items-left mx-10">                    
                    <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
                        Our Vision
                    </h2>
                    <Image className="mx-10 mt-5" src="https://img.icons8.com/external-pixer-icons-pack-dmitry-mirolyubov/88/external-horizon-weather-pixer-icons-pack-dmitry-mirolyubov.png" 
                    alt="external-horizon-weather-pixer-icons-pack-dmitry-mirolyubov" 
                    width="88" 
                    height="88"
                     />
                </div>
                <div className="lg:col-start-2 h-auto lg:h-[200px] p-4">
                    <h2 className="text-xl sm:text-xl lg:text-xl font-semibold tracking-wide text-left lg:text-left scroll-m-20 ">
                        In a world where infrastructure projects grow increasingly complex, <span className="font-semibold">BIMformative </span> 
                        envisions a future where digital workflows drive clarity, precision, and sustainability.  
                        We are committed to equipping industry professionals with the tools and knowledge to adopt and advance BIM practices seamlessly.
                    </h2>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-100 dark:bg-black rounded-xl pb-8 lg:h-[450px] items-center">
                <div className="lg:col-start-1 h-auto lg:h-[200px] p-4 flex flex-col justify-center items-left mx-10">
                    <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight mt-5">
                        What We Offer
                    </h2>
                </div>
                <div className="lg:col-start-2 h-auto lg:h-[200px] p-4">
                    <h2 className="text-xl sm:text-xl lg:text-2xl font-semibold text-left scroll-m-20 border-t mt-5 py-4">
                        Comprehensive Blogs
                    </h2>
                    <p className="mb-2 h-[75px]">on the latest industry trends, BIM software insights, and best practices.</p>
                    <Link href="/blog" className="hover:underline text-primary">Check out our blog</Link>
                </div>
                <div className="lg:col-start-3 h-auto lg:h-[200px] p-4">
                    <h2 className="text-xl sm:text-xl lg:text-2xl font-semibold text-left scroll-m-20 border-t mt-5 py-4">
                        Technical Documentation
                    </h2>
                    <p className="mb-2 h-[75px]">to guide you through every aspect of BIM processes, from initial setup to advanced workflows.</p>
                    <Link href="/docs" className="hover:underline text-primary">Check out our documentation</Link>
                </div>
                <div className="lg:col-start-2 h-auto lg:h-[200px] p-4">
                    <h2 className="text-xl sm:text-xl lg:text-2xl font-semibold text-left scroll-m-20 border-t mt-5 py-4">
                        Practical Resources
                    </h2>
                    <p className="mb-2 h-[75px]">including Dynamo scripts, C# and Python code snippets, templates, and more to streamline your BIM development.</p>
                    <Link href="/resources" className="hover:underline text-primary">Check out our resources</Link>
                </div>
                <div className="lg:col-start-3 h-auto lg:h-[200px] p-4">
                    <h2 className="text-xl sm:text-xl lg:text-2xl font-semibold text-left scroll-m-20 border-t mt-5 py-4">
                        Video Tutorials and Guides
                    </h2>
                    <p className="mb-2 h-[75px]">to help you master BIM tools and applications, ensuring your skills remain sharp and relevant</p>
                    <Link href="/resources/video-tutorials" className="hover:underline text-primary">Check out our tutorials</Link>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-100 dark:bg-black rounded-xl pb-8 lg:h-[400px] items-center">
                <div className="lg:col-start-1 h-auto lg:h-[250px] p-4 flex flex-col justify-center items-left mx-10">
                    <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
                        Why Choose BIMformative?
                    </h2>
                </div>
                <div className="lg:col-start-2 h-auto lg:h-[250px] p-4">
                    <h2 className="text-xl sm:text-xl lg:text-xl font-semibold tracking-wide text-left lg:text-left scroll-m-20 ">
                        BIMformative was born out of a need for a dedicated space where infrastructure-focused BIM professionals can access targeted resources.
                        We prioritize practical, hands-on guidance and actinable insights over theoritical content. 
                        Whether you&apos;re seasoned BIM Manager or new to BIM for Infrastructure, BIMformative provides content tailored to help you overcome challenges and enhance project efficiency.
                    </h2>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-100 dark:bg-black rounded-xl pb-8 lg:h-[400px] items-center">
                <div className="lg:col-start-1 h-auto lg:h-[250px] p-4 flex flex-col justify-center items-left mx-10">
                    <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
                        Join Our Community
                    </h2>
                </div>
                <div className="lg:col-start-2 h-auto lg:h-[200px] p-4">
                    <h2 className="text-xl sm:text-xl lg:text-xl font-semibold tracking-wide text-left lg:text-left scroll-m-20 ">
                        We&apos;re passionate about supporting the BIM community and encourage you to participate by asking questions, sharing insights, and exploring new ways to implement BIM in infrastructure projects. 
                        Follow us for updates, resources, and the latest in BIM technology and infrastructure innovation.
                    </h2>                    
                </div>
                
            </div>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">                
                <div className="lg:col-start-1 col-span-2 h-auto p-4">
                    <h2 className="text-xl sm:text-xl lg:text-xl font-semibold tracking-wide text-center scroll-m-20 ">                         
                        Follow us for updates, resources, and the latest in BIM technology and infrastructure innovation.
                    </h2>                    
                </div>
                <div className="lg:col-start-1 col-span-2 h-auto p-4">
                    <h2 className="text-xl sm:text-xl lg:text-xl font-semibold tracking-wide text-center scroll-m-20 ">                         
                    Thank you for being part of our journey. Together, let&apos;s build the future of infrastructure!
                    </h2>                    
                </div>
            </div>
        </div>        
    )
}