import {Project} from "../utils/ApiInterfaces.ts";
import {projectLoader, projectLoaderRole} from "./SharedFunctions.ts";

export interface teacherLoaderObject {
    projects: Project[]
}
export default async function teacherLoader(): Promise<teacherLoaderObject> {
    const projects: Project[] = await projectLoader(projectLoaderRole.TEACHER);
    return {"projects": projects}
}