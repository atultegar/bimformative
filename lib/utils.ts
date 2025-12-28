import { clsx, type ClassValue } from "clsx"
import { createHash } from "crypto"
import slugify from "slugify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortHash(input: string) {
  return createHash("sha256").update(input).digest("hex").slice(0, 6);
}

export function splitCamelCase(str: string) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}

export function generateSlug(title: string, ownerId?: string) {
    if (!title) title = "script";

    // 1. Normalize camelCase / PascalCase
    const spaced = splitCamelCase(title);

    // 2. Replace _ and multiple spaces
    const normalized = spaced.replace(/[_\s]+/g, " ");

    // 3. Slugify → kebab-case
    const base = slugify(normalized, {
        lower: true, 
        strict: true,
        trim: true
    });

    // 4. Hash for uniqueness
    const hash = shortHash((ownerId || "") + title);
    return `${base}-${hash}`;
}