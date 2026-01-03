export type SubscribeResult = {
    success: true;
    message: string;
}

export class KitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "KitError";
    }
}