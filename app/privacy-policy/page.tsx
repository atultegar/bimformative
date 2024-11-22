import { Metadata } from "next"

export const metadata: Metadata = {
    title : "Privacy Policy"
}

export default function Privacy() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-8 min-h-[900px]">
            <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
            <p className="mb-4">Last updated: November 22, 2024</p>

            <article className="space-y-6">
                <div>
                <h2 className="text-xl font-bold mb-2">Data Collection</h2>
                <p>We may collect personal and non-personal data, such as names, email addresses, and website usage statistics when users interact with BIMFormative (e.g., signing up for newsletters).</p>
                </div>

                <div>
                <h2 className="text-xl font-bold mb-2">Use of Data</h2>
                <p>The information collected is used to improve your experience, respond to inquiries, and deliver relevant updates or content.</p>
                </div>

                <div>
                <h2 className="text-xl font-bold mb-2">Third-Party Services</h2>
                <p>We use third-party services for analytics and marketing purposes. These services may collect cookies and usage data. Users can manage cookie preferences in their browser settings.</p>
                </div>

                <div>
                <h2 className="text-xl font-bold mb-2">User Rights</h2>
                <p>Users may request to view, update, or delete their personal information at any time by contacting us at <a href="mailto:atul.tegar@gmail.com" className="text-primary">atul.tegar@gmail.com</a>.</p>
                </div>

                <div>
                <h2 className="text-xl font-bold mb-2">Contact</h2>
                <p>If you have any questions about this Privacy Policy, contact us at <a href="mailto:atul.tegar@gmail.com" className="text-primary">atul.tegar@gmail.com</a>.</p>
                </div>
            </article>
        </section>

    )
}

