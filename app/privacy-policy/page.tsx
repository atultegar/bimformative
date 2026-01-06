import { Metadata } from "next"

export const metadata: Metadata = {
    title : "Privacy Policy",
    robots: {
        index: false,
        follow: true,
    }
}

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Privacy() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-8 min-h-[900px]">
            <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
            <p className="mb-4">Last updated: January 06, 2026</p>

            <article className="space-y-6">

                <div>
                    <h2 className="text-xl font-bold mb-2">1. Who We Are</h2>
                    <p>
                    BIMFormative (`&quot;`we`&quot;`, `&quot;`our`&quot;`, or `&quot;`us`&quot;`) operates this website to share knowledge,
                    tools, and educational resources related to Building Information Modeling (BIM).
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-2">2. Data We Collect</h2>
                    <p>We may collect the following types of data:</p>
                    <ul className="list-disc pl-6 space-y-1">
                    <li>Personal information such as name and email address (e.g. when signing in or contacting us)</li>
                    <li>Account-related information when you create an account</li>
                    <li>Comments, likes, or content you submit</li>
                    <li>Technical data such as IP address, browser type, and device information</li>
                    <li>Usage data and analytics collected via cookies (with consent)</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-2">3. How We Use Your Data</h2>
                    <p>Your data is used for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-1">
                    <li>To provide and maintain our services</li>
                    <li>To authenticate users and manage accounts</li>
                    <li>To respond to inquiries and support requests</li>
                    <li>To improve website performance and user experience</li>
                    <li>To analyze usage patterns (only with your consent)</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-2">4. Cookies & Analytics</h2>
                    <p>
                    We use cookies and similar technologies to improve functionality,
                    analyze traffic, and (in the future) display relevant advertising.
                    </p>
                    <p className="mt-2">
                    Non-essential cookies (such as analytics or advertising cookies)
                    are only used after you provide consent via our cookie banner.
                    You may withdraw or change your consent at any time.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-2">5. Third-Party Services</h2>
                    <p>
                    We use trusted third-party services to operate this website, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                    <li>Authentication providers (e.g. Clerk)</li>
                    <li>Hosting and infrastructure providers</li>
                    <li>Analytics services (e.g. Vercel Analytics)</li>
                    </ul>
                    <p className="mt-2">
                    Some of these services may process data outside the European Union.
                    We ensure appropriate safeguards are in place where required.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-2">6. Your Rights (GDPR)</h2>
                    <p>
                    If you are located in the European Economic Area (EEA), you have the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                    <li>Access your personal data</li>
                    <li>Request correction or deletion of your data</li>
                    <li>Withdraw consent at any time</li>
                    <li>Object to or restrict processing</li>
                    <li>Lodge a complaint with your local data protection authority</li>
                    </ul>
                    <p className="mt-2">
                    To exercise these rights, contact us at{" "}
                    <a href={`mailto:${contactEmail}`} className="text-primary underline">
                        {contactEmail}
                    </a>.
                    </p>
                </div>

                </article>

        </section>

    )
}
