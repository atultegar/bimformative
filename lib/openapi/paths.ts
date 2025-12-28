export const paths = {
    "/public/v1/scripts": {
        get: {
            tags: ["Scripts"],
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
}