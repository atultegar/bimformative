import crypto from "crypto";
export async function generateSHA256(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");    
}

export async function generateHash(obj: unknown): Promise<string> {
    const stableString = JSON.stringify(obj);

    return crypto
        .createHash("sha256")
        .update(stableString)
        .digest("hex");
}