export class ApiError extends Error {
    status: number;
    code: string;

    constructor(code: string, message: string, status = 500) {
        super(message);

        this.code = code;
        this.status = status;
    }
}