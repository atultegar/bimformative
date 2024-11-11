import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function Hero2() {
    return (
        <section className="text-center py-16 bg-blue-950 text-white">
            <h1 className="text-4xl font-bold">Unlock the Power of BIM for Infrastructure</h1>
            <p className='mt-4 text-lg'>Your go-to source for guides, tools, and insights into Building Information Modeling (BIM).</p>
            <div className='mt-8 space-x-4'>
                <Button asChild>
                    <Link href="/docs">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/about">Learn More</Link>
                </Button>
            </div>
        </section>
    );
}