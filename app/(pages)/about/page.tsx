import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NewsletterSignup from "../../components/NewsletterSignup";
import { PageBanner } from "../../components/PageBanner";
import Mission from "@/public/mission.png";
import AboutCover from "@/public/about-cover.png";
import MeetTheDeveloper from "../../components/MeetTheDeveloper";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "About"
}

export default function AboutPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8" >
            <PageBanner 
                title="About BIMformative"  
                description="A platform for sharing BIM automation knowledge, reusable scripts, and structured workflows for visual scripting"
            />

            <MeetTheDeveloper />
            
            {/* Intro */}
            <section className="mt-8 rounded-2xl border border-white/10 bg-gray-100/80 p-8 dark:bg-white/5">
                <div className="max-w-4xl">
                    <h2 className="text-3xl font-semibold tracking-tight">What is BIMformative?</h2>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                        BIMformative started as a knowledge-sharing space for BIM professionals,
                        but it is evolving into something more structured - a platform where
                        visual scripting workflows can be shared, versioned, compared, and reused
                        more effectively
                    </p>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                        The focus is practical: helping BIM users, developers, and teams work
                        with Dynamo and related automation workflows in a more organized and
                        scalable way
                    </p>
                </div>
            </section>

            {/* Why it exists */}
            <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-gray-100/80 p-8 dark:bg-white/5">
                    <h2 className="text-2xl font-semibold tracking-tight">Why it exists</h2>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                        In many BIM teams, scripts are stil scattered across folders, shared manually,
                        and difficult to maintain over time. BIMformative was built to reduce that friction
                        and create a more reliable workflow around script discovery, publishing, and version control
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gray-100/80 p-8 dark:bg-white/5">
                    <h2 className="text-2xl font-semibold tracking-tight">What drives it</h2>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                        The core idea behind BIMformative is simple:
                        automation should be easier to share, easier to understand, and easier to manage -
                        not limited to a few expert users or dicsonnected local files
                    </p>
                </div>
            </section>

            {/* What you'll find here */}
            <section className="mt-8 rounded-2xl border border-white/10 bg-gray-100/80 p-8 dark:bg-white/5">
                <h2 className="text-3xl font-semibold tracking-tight">What you&apos;ll find here</h2>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/40 p-6 dark:bg-black/20">
                        <h3 className="text-xl font-semibold">Dynamo scripts and resources</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            Explore reusable scripts, technical resources, and practical examples for BIM automation workflows
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/40 p-6 dark:bg-black/20">
                        <h3 className="text-xl font-semibold">Version-aware workflows</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            Compare script versions, understand what changed, and move toward more structured automation management
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/40 p-6 dark:bg-black/20">
                        <h3 className="text-xl font-semibold">Technical writing and guides</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            Read articles, implementation notes, and workflow breakdowns focused on real BIM and automation problems
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/40 p-6 dark:bg-black/20">
                        <h3 className="text-xl font-semibold">An eveolving platform</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            BIMformative is actively growing into a connected ecosystem for script sharing, extension-based access, and future workflow integrations
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mt-8 mb-12 rounded-2xl border border-white/10 bg-gray-100/80 p-8 text-center dark:bg-white/5">
                <h2 className="text-3xl font-semibold tracking-tight">
                    Explore the platform
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                    Whether you want to discover scripts, publish your own workflows, or follow the evolution of BIM automation, BIMformative is built to support that journey
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button asChild>
                        <Link href="/resources/dynamo-scripts">Explore Scripts</Link>                        
                    </Button>
                    <Button asChild variant={"outline"}>
                        <Link href="/blog">Read the Blog</Link>                        
                    </Button>
                </div>
            </section>
        </div>        
    );
}