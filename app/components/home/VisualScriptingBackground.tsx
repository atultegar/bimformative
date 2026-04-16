"use client";

import { motion } from "framer-motion";

type NodePoint = {
    id: string;
    x: number;
    y: number;
    size?: number;
};

type Edge = {
    id: string;
    from: string;
    to: string;
};

const nodes: NodePoint[] = [
    { id: "n1", x: 8, y: 55, size: 1 },
    { id: "n2", x: 15, y: 50, size: 1 },
    { id: "n3", x: 25, y: 55, size: 1 },
    { id: "n4", x: 48, y: 55, size: 1 },
    { id: "n5", x: 62, y: 65, size: 1 },
    { id: "n6", x: 80, y: 50, size: 1 },
    { id: "n7", x: 92, y: 60, size: 1 },

    { id: "n8", x: 10, y: 62, size: 1 },
    { id: "n9", x: 20, y: 65, size: 1 },
    { id: "n10", x: 80, y: 55, size: 1 },
    { id: "n11", x: 58, y: 72, size: 1 },
    { id: "n12", x: 80, y: 60, size: 1 },
];

const edges: Edge[] = [
    { id: "e1", from: "n1", to: "n2" },
    { id: "e2", from: "n2", to: "n3" },
    { id: "e3", from: "n3", to: "n4" },
    { id: "e4", from: "n4", to: "n6" },
    { id: "e5", from: "n5", to: "n10" },
    { id: "e6", from: "n6", to: "n7" },

    { id: "e7", from: "n8", to: "n3" },
    { id: "e8", from: "n9", to: "n4" },
    { id: "e9", from: "n10", to: "n7" },
    { id: "e10", from: "n12", to: "n7" },

    { id: "e13", from: "n4", to: "n12" },
    { id: "e15", from: "n11", to: "n7" },
];

function getNode(id: string) {
    return nodes.find((n) => n.id === id)!;
}

function getLinePath(fromId: string, toId: string, offset = 0) {
    const from = getNode(fromId);
    const to = getNode(toId);

    const dx = (to.x - from.x) * 0.5

    return `M ${from.x + 2} ${from.y + offset}
            C ${from.x + dx} ${from.y + offset},
            ${to.x - dx} ${to.y - offset},
            ${to.x - 2} ${to.y - offset}`;
}

export default function VisualScriptingBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 overflow-hidden">
            {/* soft background glow */}
            <div className="absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute right-16 top-16 h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute left-10 bottom-10 h-[220px] w-[220px] rounded-full bg-sky-400/5 blur-3xl" />

            <motion.svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
                className="h-full w-full opacity-35"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}>
                    <motion.g
                        animate={{
                            x: [0, 0.6, 0],
                            y: [0, -0.5, 0],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >                        
                    
                    {/* base connector lines */}
                    {edges.map((edge, index) => {
                        const offset = (index % 3 - 1) * 0.6;
                        return (
                        <g key={edge.id}>
                            <motion.path
                                d={getLinePath(edge.from, edge.to, offset)}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="0.16"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.42 }}
                                transition={{
                                    duration: 1.1,
                                    delay: index * 0.05,
                                    ease: "easeOut",
                                }}
                            />

                            {/* sub data pulse */}
                            <circle r="0.2" fill="#67e8f9" filter="url(#pulseGlow)">
                                <animateMotion
                                    dur={`${1 + (index % 4)}s`}
                                    begin={`${index * 0.18}s`}
                                    repeatCount="indefinite"
                                    path={getLinePath(edge.from, edge.to, offset)}
                                    />
                            </circle>
                        </g>
                    )}
                    )}

                    {/* nodes */}
                    {nodes.map((node, index) => (
                        <motion.g
                            key={node.id}
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.55,
                                delay: 0.35 + index * 0.04,
                                ease: "easeOut",
                            }}
                            style={{
                                transformOrigin: `${node.x}% ${node.y}%`,
                            }}
                        >
                            <motion.rect
                                x={node.x - 1.9}
                                y={node.y - 1.15}
                                width={3.8}
                                height={2.3}
                                rx={0.55}
                                fill="url(#nodeGlow)"
                                animate={{
                                    opacity: [0.16, 0.3, 0.16],
                                }}
                                transition={{
                                    duration: 4.5,
                                    delay: index * 0.15,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* main node */}
                            <motion.rect
                                x={node.x - 1.55}
                                y={node.y - 0.95}
                                width={3.1}
                                height={1.9}
                                rx={0.25}
                                fill="url(#nodeFill)"
                                stroke="rgba(103,232,249,0.55)"
                                strokeWidth="0.12"
                                animate={{
                                    y: [node.y - 0.95, node.y - 1.03, node.y - 0.95],
                                    opacity: [0.82, 1, 0.82],
                                }}
                                transition={{
                                    duration: 4.2,
                                    delay: index * 0.14,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* top accent line */}
                            <rect
                                x={node.x - 1.18}
                                y={node.y - 0.42}
                                width={2.36}
                                height={0.16}
                                rx={0.08}
                                fill="rgba(103,232,249,0.72)"
                            />

                            {/* tiny inner port/highlight */}
                            <rect
                                x={node.x - 0.34}
                                y={node.y + 0.12}
                                width={0.68}
                                height={0.22}
                                rx={0.1}
                                fill="rgba(186,230,253,0.85)"
                            />
                        </motion.g>
                    ))}
                </motion.g>

                <defs>
                    <linearGradient id="lineGradient" x1="100%" y1="100%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0,211,242,0.7)" />
                        <stop offset="50%" stopColor="rgba(0,211,242,0.1)"/>
                        <stop offset="100%" stopColor="rgba(0,211,242,0.7)" />
                    </linearGradient>

                    <linearGradient id="nodeFill" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(15,23,42,0.96)" />
                        <stop offset="30%" stopColor="rgba(30,41,59,0.88)" />
                    </linearGradient>

                    <linearGradient id="nodeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34,211,238,0.22)" />
                        <stop offset="30%" stopColor="rgba(59,130,246,0.08)" />
                    </linearGradient>

                    <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="0.45" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </motion.svg>
        </div>
    );
}