import { PublishVisualScriptInput } from "@/lib/core/contracts/publish/PublishVisualScriptInput";
import { ApiError } from "@/lib/shared/errors/ApiError";

export class GhPublishValidator {
    validate(input: PublishVisualScriptInput) {
        if (!input.file) {
            throw new ApiError(
                "FILE_REQUIRED",
                "Grasshopper file is required",
                400
            );
        }

        if (!input.parsedGraph) {
            throw new ApiError(
                "GRAPH_REQUIRED",
                "Parsed graph is required",
                400
            );
        }

        const extension = input.file.name
            .split(".")
            .pop()
            ?.toLowerCase();

        if (
            extension !== "gh" &&
            extension !== "ghx"
        ) {
            throw new ApiError(
                "INVALID_FILE_TYPE",
                "Invalid Grasshopper file",
                400
            );
        }
    }
}