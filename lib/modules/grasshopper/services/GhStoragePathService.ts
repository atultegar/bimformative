export class GhStoragePathService {
    static buildPath(
        slug: string,
        version: number
    ) {
        return `${slug}/v${version}.gh`;
    }
}