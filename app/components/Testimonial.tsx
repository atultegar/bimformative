import React from "react";

export default function Testimonial() {
    return (
        <section className="max-w-7xl mx-auto mt-10 py-16 bg-gray-100 dark:bg-black">
            <h2 className="text-3xl font-semibold text-center">What Our Users Say</h2>
            <blockquote className="mt-8 max-w-3xl mx-auto text-center text-gray-700 italic">
            &quot;BIMformative has been an invaluable resource for our team&apos;s BIM projects. The scripts and guides have streamlined our workflows and saved countless hours.&quot;
            </blockquote>
            <blockquote className="mt-8 max-w-3xl mx-auto text-center text-gray-700 italic">
                &quot;BIMformative has transformed the way I approach BIM for infrastructure projects. The detailed articles and practical resources, especially the 
                well-structured Dynamo scripts, have saved me countless hours of work. The scripts are easy to use and customize, making even complex tasks much simpler to execute. 
                Whether you&apos;re just starting out or a seasoned professional, this platform is an invaluable asset. Highly recommended!&quot;
            </blockquote>
        </section>
    )
}