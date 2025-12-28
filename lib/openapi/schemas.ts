import { nullable } from "zod";

export const ScriptMinimalSchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        slug: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        script_type: { type: "string", enum: ["revit", "civil3d" ] },
        current_version_number: { type: "integer" },
        owner_id: { type: "string" },
        owner_first_name: { type: "string" },
        owner_last_name: { type : "string" },
        owner_avatar_url: { type: "string", nullable: true },
        demo_link: { type: "string", nullable: true },
        downloads_count: { type: "integer" },
        likes_count: { type: "integer" },
    },
};
    