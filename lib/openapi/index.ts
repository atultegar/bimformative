import { baseOpenApi } from "./base";
import { paths } from "./paths";
import {
    ScriptMinimalSchema
} from "./schemas";

export const openApiSpec = {
    ...baseOpenApi,
    paths,
    components: {
        ...baseOpenApi.components,
        schemas: {
            ScriptMinimal: ScriptMinimalSchema,
        },
    },
};