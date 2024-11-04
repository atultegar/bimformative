import { authorType } from "./author";
import { blogsType } from "./blog";
import { codeType } from "./codeType";
import { dynamoScriptType } from "./dynamoscript";
import { projectsType } from "./project";
import { youTube } from "./youTubeType";

export const schemaTypes = [projectsType, blogsType, authorType, youTube, dynamoScriptType, codeType]
