import crypto from "crypto";

export class HashService {
    static async generateHash(input: any): Promise<string> {
        return crypto
            .createHash("sha256")
            .update(JSON.stringify(input))
            .digest("hex");
    }
}
