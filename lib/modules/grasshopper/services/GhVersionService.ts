import { GhScriptVersionRepository } from "@/lib/infrastructure/supabase/repositories/ghscripts/GhScriptVersionRepository";

export class GhVersionService {
    private readonly repo = new GhScriptVersionRepository();

    async createNextVersion(
        scriptId: string
    ) {
        const latest = await this.repo.getLatestVersion(scriptId);

        await this.repo.resetCurrentVersions(scriptId);

        return (latest ?.version_number ?? 0) + 1;
    }
}