import { Metadata } from "next";
import { PageBanner } from "../../components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTools } from "@/lib/services/tools.service";

export const metadata: Metadata = {
    title : "Tools"
}

export default async function ToolsPage() {
    const tools = await getTools();
    return (
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8">
            <PageBanner title="Tools" description="Open-source and commercial tools for Dynamo, Revit, Civil 3D and computational design workflows." variant="dynamo" />            
            
            <div className="mt-12 mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {tools?.map((tool, idx) => (
                    <Card key={idx} className="dark:bg-white/5 backdrop-blur-sm dark:border-white/10">
                        <CardContent>
                            <h2 className="text-2xl font-semibold mt-4">
                                {tool.name}
                            </h2>

                            <p className="mt-3 text-muted-foreground">
                                {tool.short_description}
                            </p>

                            <div className="mt-4 text-sm">
                                Version: {tool.latest_version}
                            </div>

                            <Button asChild className="mt-6">
                                <Link href={`/tools/${tool.slug}`}>
                                    View Tool
                                </Link>
                            </Button>
                        </CardContent>

                    </Card>
                ))}
                
            </div>
        </section>
    );
}