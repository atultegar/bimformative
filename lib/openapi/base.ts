import { OpenAPIObject } from "openapi3-ts/oas31";

export const baseOpenApi: OpenAPIObject = {
    openapi: "3.1.0",
    info: {
        title: "BIMformative API",
        version: "1.0.0",
        description: "Public & authenticated API for BIMformative scripts",
    },
    servers: [
        { url: "https://bimformative.com/api", description: "Production server" },
        { url: "http://localhost:3000/api", description: "Local server" },
    ],
    components: {
        securitySchemes: {
            clerkAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};