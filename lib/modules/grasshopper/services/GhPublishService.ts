import { GhScriptRepository } from "@/lib/infrastructure/supabase/repositories/ghscripts/GhScriptRepository";
import { GhScriptVersionRepository } from "@/lib/infrastructure/supabase/repositories/ghscripts/GhScriptVersionRepository";
import { StorageService } from "@/lib/infrastructure/supabase/storage/StorageService";
import { GhVersionService } from "./GhVersionService";
import { PublishVisualScriptInput } from "@/lib/core/contracts/publish/PublishVisualScriptInput";
import { generateSlug } from "@/lib/core/utils/slug";
import { GhStoragePathService } from "./GhStoragePathService";
import { HashService } from "@/lib/core/services/hashing/HashService";

export class GhPublishService {
    private readonly scriptRepo = new GhScriptRepository();

    private readonly versionRepo = new GhScriptVersionRepository();

    private readonly storage = new StorageService();

    private readonly versionService = new GhVersionService();

    async publish(input: PublishVisualScriptInput) {
        const baseTitle = input.title ?? input.file.name.replace(/\.[^/.]+$/, "");

        const slug = generateSlug(baseTitle, input.userId);

        let script = await this.scriptRepo.getBySlug(slug);

        if (!script) {
            script = await this.scriptRepo.create({
                owner_id: input.userId,
                organization_id: input.organizationId,
                title: baseTitle,
                slug,
                description: input.description,
                visibility: input.visibility,
                tags: input.tags,
                current_version_number: 0,
            });
        }

        const version = await this.versionService.createNextVersion(script.id);

        const path = GhStoragePathService.buildPath(slug, version);

        const fileUrl = await this.storage.uplaodFile("grasshopper-scripts", path, input.file);

        const graphJson = {
            nodes: input.parsedGraph.Nodes ?? [],
            connectors: input.parsedGraph.Connectors ?? [],
            bounds: input.parsedGraph.Bounds ?? null,
        }

        const hash = await HashService.generateHash(graphJson);

        const versionRow = await this.versionRepo.create({
            ghscript_id: script.id,
            version_number: version,
            is_current: true,
            graph_json: graphJson,
            semantic_json: input.parsedGraph.Semantic ?? {},
            original_file_url: fileUrl,
            rhino_version: input.parsedGraph?.RhinoVersion,
            grasshopper_version: input.parsedGraph?.GrasshopperVersion,
            packages: input.parsedGraph?.ExternalPlugins ?? [],
            node_count: graphJson.nodes.length,
            connector_count: graphJson.connectors.length,
            has_python: input.parsedGraph?.HasPython ?? false,
            has_csharp: input.parsedGraph?.HasCSharp ?? false,
            has_clusters: input.parsedGraph?.HasClusters ?? false,
            graph_bounds: input.parsedGraph?.Bounds ?? null,
            hash,
        });

        await this.scriptRepo.update(
            script.id,
            {
                current_version_number: version,                
            }
        );

        return {
            scriptId: script.id,
            slug,
            version,
            downloadUrl: fileUrl,
            versionId: versionRow.id,
        };
    }
}