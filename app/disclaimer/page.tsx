import { Metadata } from "next"

export const metadata: Metadata = {
    title : "Disclaimer"
}

export default function Disclaimer() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-8 min-h-[900px]">
            <h1 className="text-3xl font-semibold mb-6">Disclaimer</h1>
            <p className="mb-4">Last updated: November 22, 2024</p>
            
            <article className="space-y-6">
                <div>
                <h2 className="text-xl font-bold mb-2">General Information</h2>
                <p>BIMFormative provides content for informational purposes only. While we strive for accuracy, we cannot guarantee that all content is up-to-date or error-free.</p>
                </div>

                <div>
                <h2 className="text-xl font-bold mb-2">Professional Advice</h2>
                <p>The material on this website does not constitute professional advice. For specific concerns or questions, please consult a qualified professional.</p>
                </div>

                <div>
                <h2 className="text-xl font-bold mb-2">Third-Party Links</h2>
                <p>BIMFormative may include links to third-party websites. We do not control or endorse their content and are not responsible for their practices or policies.</p>
                </div>

                <div>
                <h2 className="text-xl font-bold mb-2">Liability</h2>
                <p>BIMFormative is not liable for any loss, damage, or inconvenience caused by the use of information provided on this site.</p>
                </div>
            </article>
        </section>
    )
}


