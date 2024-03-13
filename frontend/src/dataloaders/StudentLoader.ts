import {Project} from "../utils/ApiInterfaces.ts";
import {projectsLoader, teacherStudentRole} from "./SharedFunctions.ts";

export interface studentLoaderObject {
    projects: Project[]
}
export default async function studentLoader(): Promise<studentLoaderObject> {
    const projects: Project[] = await projectsLoader(teacherStudentRole.STUDENT);
    // TODO: add submission data
    return {"projects": projects};
}