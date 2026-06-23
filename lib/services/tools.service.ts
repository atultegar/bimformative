import { ApiError } from "../api/errors";
import { supabaseServer } from "../supabase/server";

export interface CreateToolInput {
    name: string;
    slug: string;

    shortDescription?: string;
    description?: string;

    logoUrl?: string;

    githubUrl?: string;
    websiteUrl?: string;

    documentationUrl?: string;
}

export interface CreateToolVariantInput {
    toolId: string;
    name: string;
    hostApplication: string;
    hostVersion: string;
}

export interface CreateToolReleaseInput {
    variantId: string;
    version: string;
    changelog?: string;
    downloadUrl: string;
    fileSize?: number;
    isLatest?: boolean;
}

// CREATE
export async function createTool(input: CreateToolInput){
    const supabase = supabaseServer();

    const { data: existing } = await supabase
        .from("tools")
        .select("id")
        .eq("slug", input.slug)
        .maybeSingle();

    if (existing) {
        throw new ApiError(
            "TOOL_ALREADY_EXISTS",
            "Tool slug already exists",
            409
        );
    }

    const { data, error } = await supabase
        .from("tools")
        .insert({
            name: input.name,
            slug: input.slug,

            short_description: input.shortDescription,
            description: input.description,

            logo_url: input.logoUrl,

            github_url: input.githubUrl,
            website_url: input.websiteUrl,
            documentation_url: input.documentationUrl
        })
        .select()
        .single();

    if (error) {
        throw new ApiError(
            "CREATE_TOOL_FAILED",
            error.message,
            500
        );
    }

    return data;
}

export async function createToolVariant(
    input: CreateToolVariantInput
) {
    const supabase = supabaseServer();
    
    const { data, error } = await supabase
        .from("tool_variants")
        .insert({
            tool_id: input.toolId,
            name: input.name,
            host_application: input.hostApplication,
            host_version: input.hostVersion
        })
        .select()
        .single();

    if (error) {
        throw new ApiError(
            "CREATE_TOOL_FAILED",
            error.message,
            500
        );
    }

    return data;
}

export async function createToolRelease(
    input: CreateToolReleaseInput
) {
    const supabase = supabaseServer();

    if (input.isLatest) {
        await supabase
            .from("tool_releases")
            .update({
                is_latest: false
            })
            .eq("variant_id", input.variantId);
    }
    
    const { data, error } = await supabase
        .from("tool_releases")
        .insert({
            variant_id: input.variantId,
            version: input.version,
            changelog: input.changelog,
            dowload_url: input.downloadUrl,
            file_size: input.fileSize,
            is_latest: input.isLatest ?? false
        })
        .select()
        .single();

    if (error) {
        throw new ApiError(
            "CREATE_TOOL_FAILED",
            error.message,
            500
        );
    }

    return data;
}

// GET
export async function getTools() {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("tools")
        .select(`*`);

    return data;
}

export async function getToolBySlug(slug: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("tools")
        .select(`
            *,
            tool_variants (
                *,
                tool_releases (
                    *
                )
            )
        `)
        .eq("slug", slug)
        .single();

    if (error || !data){
        throw new ApiError(
            "TOOL_NOT_FOUND",
            "Tool not found",
            404
        );
    }

    return data;
}
