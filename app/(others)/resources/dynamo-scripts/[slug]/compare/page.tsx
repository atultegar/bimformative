import CompareClient from "@/app/components/scripts/CompareClient";

interface ScriptPageProps {
    params: Promise<{ slug: string}>;
}
export default async function ComparePage({ params }: ScriptPageProps) {        
    const { slug } = await params;

    return (
        <section className="mx-auto">
            <div className="max-w-7xl w-full px-4 md:px-8 mx-auto">
                <CompareClient slug={slug} />
            </div>
        </section>        
    );
}
