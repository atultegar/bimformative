export const navigationItems = [
    { name: 'Home', href: '/' },
    {
        name: 'Resources',
        href: '/resources',
        submenu : [
            { name: "Dynamo Scripts", href: '/resources/dynamo-scripts', description: "Downloadable Dynamo scripts" },
            { name: "C# Snippets", href: '/resources/csharp-snippets', description: "C# code for BIM development" },
            { name: "Python Scripts", href: '/resources/python-scripts', description: "Python scripts for BIM applications" },
            { name: "Video Tutorials", href: '/resources/video-tutorials', description: "In-depth video tutorials" },
            { name: "Other Assets", href: '/resources/other-assets', description: "Other assets for BIM" },
        ],
    },        
    { name: 'Docs', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Tools', href: '/tools' },
    { name: 'About', href: '/about' },
];