import {Project} from "../utils/ApiInterfaces.ts";
import {projectsLoader, teacherStudentRole} from "./SharedFunctions.ts";

export interface teacherLoaderObject {
    projects: Project[]
}

export const TEACHER_ROUTER_ID = "teacher";

export default async function teacherLoader(): Promise<teacherLoaderObject> {
    const projects: Project[] = await projectsLoader(teacherStudentRole.TEACHER);
    return {"projects": projects}
}