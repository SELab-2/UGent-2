import {Project} from "../utils/ApiInterfaces.ts";
import {projectLoader, projectLoaderRole} from "./SharedFunctions.ts";

export interface studentLoaderObject {
    projects: Project[]
}
export default async function studentLoader(): Promise<studentLoaderObject> {
    const projects: Project[] = await projectLoader(projectLoaderRole.STUDENT);
    // TODO: add submission data
    return {"projects": projects};
}