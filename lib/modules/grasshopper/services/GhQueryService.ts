import { GhScriptRepository } from "@/lib/infrastructure/supabase/repositories/ghscripts/GhScriptRepository";

export class GhQueryService {
    private readonly repo = new GhScriptRepository();

    async getBySlug(
        slug: string
    ) {
        return this.repo.getBySlug(slug);
    }
}