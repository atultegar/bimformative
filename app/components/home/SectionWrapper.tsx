export function SectionWrapper({
    children,
    highlight = false,
} : {
    children: React.ReactNode;
    highlight?: boolean;
}) {
    return (
        <section
            className={`
                relative w-full py-24
                border-t border-white/5
                before:absolute before:top-0 before:left-0 before:w-full before:h-px
                before:bg-gradient-to-r before:from-transparent before:via-cyan-500/20 before:to-transparent
                ${highlight ? "bg-gradient-to-b from-transparent to-gray-500/20 dark:to-white/5" : ""}
            `}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {children}
            </div>
        </section>
    )
}