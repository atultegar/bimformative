import { NextResponse } from "next/server";
import { ApiError } from "./errors";

export function successResponse<T>(data: T, status = 200) {
    return NextResponse.json(
        {
            success: true,
            data,
        },
        { status }
    );
}

export function unauthorizedResponse(message = "Authentication required") {
    return NextResponse.json(
        {
            success: false,
            error: {
                code: "UNAUTHORIZED",
                message,
            },            
        },
        { status: 401 }
    );
}

export function handleApiError( err: unknown) {
    if (err instanceof ApiError) {
        return NextResponse.json(
            { 
                success: false,
                error: {
                    code: err.code,
                    message: err.message,
                },
            },
            { status: err.status }
        );
    }

    return internalErrorResponse();    
}

export function internalErrorResponse(message = "Something went wrong") {
    return NextResponse.json(
        {
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: message,
            },
        },
        { status: 500 }
    );
}