"use client";

import ScriptCompare from "@/app/components/ScriptCompare";
import NodeValueDiff from "@/app/components/scripts/NodeValueDiff";
import SideBySideDiff from "@/app/components/SideBySideDiff";
import { formatDate } from "@/app/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { diffScripts } from "@/lib/diff/diffScripts";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import dynamoImage from "@/public/dynamo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface props {
    slug: string;
}

function renderChangedNodeDiff(nodeA:any, nodeB:any) {
    switch (nodeA.NodeType) {
        case "CodeBlockNode":
        case "StringInputNode":
        case "NumberInputNode":
        case "BooleanInputNode":
            return (
                <NodeValueDiff
                    title={`${nodeA.Name} - Input changed`}
                    oldValue={nodeA.InputValue || ""}
                    newValue={nodeB.InputValue || ""}
                    language="text"
                    darkMode={true}
                />
            );

        case "PythonScriptNode":
            return (
                <SideBySideDiff
                    oldValue={nodeA.Code}
                    newValue={nodeB.Code}
                    title={nodeA.Name ?? "Python Script"}
                    darkMode={true}
                 />
            );

        default:
            return null;        
    }
}

export default function CompareClient({ slug }: props) {
    const [data, setData] = useState<any|null>(null);
    const [title, setTitle] = useState<string>("");

    

    useEffect(() => {
        const stored = sessionStorage.getItem("payload");

        async function loadComparison(payload: any) {
            const res = await fetch(`/api/public/v1/scripts/${slug}/compare`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            setData(json.data);
            setTitle(payload.title);
        }

        if (!stored) return;

        try {
            const parsed = JSON.parse(stored);

            // Clear immediately (before async call)
            sessionStorage.removeItem("payload");

            loadComparison(parsed);
        } catch (err) {
            console.error("Invalid payload in sessionStorage");
            sessionStorage.removeItem("payload");
        }
    }, [slug]);

    if (!data || data.error) {
        return (
            <Button className="flex mx-auto" disabled size="lg" variant="outline">
                <Spinner data-icon="inline-start"/>
                Loading...
            </Button>
        );
    } 

    const {left, right} = data;

    const { removedNodeIds, addedNodeIds, changedNodeIds } = diffScripts(left.nodes, right.nodes);

    return (
        <Card className="max-w-[1200px] w-full mx-auto my-10">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Image src={dynamoImage} alt="Dynamo Script" className="w-8 h-8" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>                
                {/* Verison Metadata */}
                <div className="grid grid-cols-2 gap-8 border-b pb-4">
                    {/* Version A */}
                    <div className="space-y-2">
                        <h4 className="font-semibold justify-center">
                            Version: 
                            <Badge variant="outline">V{left.version_number}</Badge>
                        </h4>                    
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold justify-center">
                            Version:
                            <Badge variant="outline">V{right.version_number}</Badge>
                        </h4>                    
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 py-3 pb-2">
                    {/* Script A Metadata */}
                    <div className="space-y-2">
                        <Section title="UpdatedAt">
                            <span>{formatDate(left.updated_at)}</span>
                        </Section>
                        {left.changelog && (
                            <Section title="Changelog">
                                <span>{left.changelog}</span>
                            </Section>
                        )}
                        <Section title="Dynamo Version">
                            <span>{left.dynamo_version}</span>
                        </Section>
                        <Section title="Dynamo Player Ready">
                            {left.is_player_ready ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </Section>
                        <Section title="External Packages">
                            {left.external_packages?.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {left.external_packages.map((pkg: string, i: number) => (
                                        <li key={i}>{pkg}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No external packages used.</p>
                            )}
                        </Section>
                    </div>

                    {/* Script B Metadata */}
                    <div className="space-y-2">
                        <Section title="UpdatedAt">
                            <span>{formatDate(right.updated_at)}</span>
                        </Section>
                        {right.changelog && (
                            <Section title="Changelog">
                                <span>{right.changelog}</span>
                            </Section>
                        )}
                        <Section title="Dynamo Version">
                            <span>{right.dynamo_version}</span>
                        </Section>
                        <Section title="Dynamo Player Ready">
                            {right.is_player_ready ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </Section>
                        <Section title="External Packages">
                            {right.external_packages?.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {right.external_packages.map((pkg: string, i: number) => (
                                        <li key={i}>{pkg}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No external packages used.</p>
                            )}
                        </Section>
                    </div>
                </div>
                
                <ScriptCompare 
                    oldNodes={left.nodes} 
                    oldConnectors={left.connectors} 
                    newNodes={right.nodes} 
                    newConnectors={right.connectors} 
                />

                <div className="space-y-6 mt-6">
                    <h4 className="text-sm font-semibold mb-1 text-gray-700">Changed Nodes</h4>
                    {changedNodeIds.size === 0 && (
                        <p className="text-sm text-gray-500">No input/code changes detected.</p>
                    )}

                    {Array.from(changedNodeIds).map((nodeId) => {
                        const oldNode = left.nodes.find((n:any) => n.Id === nodeId);
                        const newNode = right.nodes.find((n:any) => n.Id === nodeId);
                        if(!oldNode || !newNode) return null;

                        return (
                            <div key={nodeId}>
                                {renderChangedNodeDiff(oldNode, newNode)}
                            </div>
                        )
                    })}

                </div>
            </CardContent>
            
        </Card>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-1 text-gray-700">{title}</h4>
            <div className="text-sm">{children}</div>
        </div>
    );
}
