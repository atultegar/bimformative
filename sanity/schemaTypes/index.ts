import { authorType } from "./author";
import { blogsType } from "./blog";
import { codeType } from "./codeType";
import { dynamoScriptType } from "./dynamoscript";
import { dynamosoftwares } from "./dynamosoftwares";
import { projectsType } from "./project";
import { tag } from "./tag";
import { youTube } from "./youTubeType";
import { testimonial } from "./testimonial";

export const schemaTypes = [projectsType, blogsType, authorType, youTube, dynamoScriptType, codeType, tag, dynamosoftwares, testimonial]