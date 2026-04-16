export const paths = {
    "/api/public/v1/scripts": {
        get: {
            tags: ["PublicScripts"],
            summary: "List public scripts",
            responses: {
                200: {
                    description: "List of public scripts",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    scripts: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/ScriptMinimal" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    "/api/v1/scripts": {
        get: {
            tags: ["UserScripts"],
            summary: "List of scripts by user",
            responses: {
                200: {
                    description : "List of scripts by user",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    scripts: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/ScriptMinimal" },
                                    },
                                },
                            },
                        },
                    }
                }
            }
        }
    }
}