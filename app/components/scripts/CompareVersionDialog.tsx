"use client";

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dynamoImage from "@/public/dynamo.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import ScriptCompare from "../ScriptCompare";
import { ScrollArea } from "@/components/ui/scroll-area";
import { buildComparableMap, formatDate } from "@/app/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NodeValueDiff from "./NodeValueDiff";
import { diffScripts } from "@/lib/diff/diffScripts";
import SideBySideDiff from "../SideBySideDiff";
import { MinimalVersion } from "@/lib/types/version";
import { getVersionByIdAction } from "@/app/actions/serverActions";

interface CompareScriptProps {
    scriptTitle: string;
    versions: MinimalVersion[];
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

export default function CompareVersionDialog({ scriptTitle, versions }:CompareScriptProps) {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
    const [versionAData, setVersionAData] = useState<any | null>(null);
    const [versionBData, setVersionBData] = useState<any | null>(null);

    // Sort versions by version_number
    const sorted = [...versions].sort(
        (a, b) => a.version_number - b.version_number
    );

    const versionAId = sorted[0].id;
    const versionBId = sorted[1].id;


    // Fetch version details + JSON data
    useEffect(() => {
        async function fetchVersion(versionId: string) {
            const version = await getVersionByIdAction(versionId);

            if(!version) return null;
            
            return version;
        }
        async function load() {
            const [vA, vB] = await Promise.all([
                fetchVersion(versionAId),
                fetchVersion(versionBId),
            ]);

            /** Build comparable maps **/
            const comparableA = buildComparableMap(vA.nodes);
            const comparableB = buildComparableMap(vB.nodes);

            setVersionAData({
                ...vA,
                comparableMap: comparableA
            });
            setVersionBData({
                ...vB,
                comparableMap: comparableB
            });
        }

        load();
        
    }, [versionAId, versionBId]);

    // Still loading
    if (!versionAData || !versionBData) {
        return (
            <DialogContent>
                <p className="py-10 text-center">Loading version comparison...</p>
            </DialogContent>
        );
    }

    const { removedNodeIds, addedNodeIds, changedNodeIds } = diffScripts(versionAData.nodes, versionBData.nodes);
    
    return (
        <DialogContent className="max-w-[1400px] w-full max-h-[1000px] mx-auto">
            <DialogHeader>
                <DialogTitle className="flex items-center">
                    <Image src={dynamoImage} alt="Dynamo Script" className="w-8 h-8" />
                    Dynamo Script Compare
                </DialogTitle>
            </DialogHeader>
            <h3 className="text-lg font-semibold">{scriptTitle}</h3>

            {/* Verison Metadata */}
            <div className="grid grid-cols-2 gap-8 border-b pb-4">
                {/* Version A */}
                <div className="space-y-2">
                    <h4 className="font-semibold justify-center">
                        Version: 
                        <Badge variant="outline">V{versionAData.version_number}</Badge>
                    </h4>                    
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold justify-center">
                        Version:
                        <Badge variant="outline">V{versionBData.version_number}</Badge>
                    </h4>                    
                </div>
            </div>
            <ScrollArea className="h-[600px] pr-2">
                <div className="grid grid-cols-2 gap-8 py-3 pb-2">
                    {/* Script A Metadata */}
                    <div className="space-y-2">
                        <Section title="UpdatedAt">
                            <span>{formatDate(versionAData.updated_at)}</span>
                        </Section>
                        {versionAData.changelog && (
                            <Section title="Changelog">
                                <span>{versionAData.changelog}</span>
                            </Section>
                        )}
                        <Section title="Dynamo Version">
                            <span>{versionAData.dynamo_version}</span>
                        </Section>
                        <Section title="Dynamo Player Ready">
                            {versionAData.is_player_ready ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </Section>
                        <Section title="External Packages">
                            {versionAData.external_packages?.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {versionAData.external_packages.map((pkg: string, i: number) => (
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
                            <span>{formatDate(versionBData.updated_at)}</span>
                        </Section>
                        {versionBData.changelog && (
                            <Section title="Changelog">
                                <span>{versionBData.changelog}</span>
                            </Section>
                        )}
                        <Section title="Dynamo Version">
                            <span>{versionBData.dynamo_version}</span>
                        </Section>
                        <Section title="Dynamo Player Ready">
                            {versionBData.is_player_ready ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </Section>
                        <Section title="External Packages">
                            {versionBData.external_packages?.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {versionBData.external_packages.map((pkg: string, i: number) => (
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
                    oldNodes={versionAData.nodes} 
                    oldConnectors={versionAData.connectors} 
                    newNodes={versionBData.nodes} 
                    newConnectors={versionBData.connectors} 
                />

                <div className="space-y-6 mt-6">
                    <h4 className="text-sm font-semibold mb-1 text-gray-700">Changed Nodes</h4>
                    {changedNodeIds.size === 0 && (
                        <p className="text-sm text-gray-500">No input/code changes detected.</p>
                    )}

                    {Array.from(changedNodeIds).map((nodeId) => {
                        const oldNode = versionAData.nodes.find((n:any) => n.Id === nodeId);
                        const newNode = versionBData.nodes.find((n:any) => n.Id === nodeId);
                        if(!oldNode || !newNode) return null;

                        return (
                            <div key={nodeId}>
                                {renderChangedNodeDiff(oldNode, newNode)}
                            </div>
                        )
                    })}

                </div>
            </ScrollArea>                        
        </DialogContent>
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