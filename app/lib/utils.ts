import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  const formatted = date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  return formatted.replaceAll(",", "");
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function capitalizeWords(input: string) {
  return input
    .split(/[\s-]+/) // Split by spaces or hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function extractNodeValue(node: any) {
  const type = node.NodeType;

  switch (type) {
    case "CodeBlockNode":
    case "StringInputNode":
    case "NumberInputNode":
    case "BooleanInputNode":
      return node.InputValue ?? null;

    case "PythonScriptNode":
      return node.Code ?? null;

    default:
      return null;
  }
}

export function buildComparableMap(nodes: any[]) {
  const map: Record<string, { type: string; value: any}> = {};

  nodes.forEach(node => {
    const value = extractNodeValue(node);

    if (value !== null) {
      map[node.Id] = {
        type: node.NodeType,
        value
      };
    }
  });

  return map;
}