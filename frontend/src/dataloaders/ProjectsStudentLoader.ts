import {CompleteProject} from "../utils/ApiInterfaces.ts";
import {projectsLoader, teacherStudentRole} from "./SharedFunctions.ts";

export const PROJECTS_STUDENT_ROUTER_ID = "projects_student";

export interface projectsStudentLoaderObject {
    projects: CompleteProject[]
}

export default async function projectsStudentLoader(): Promise<projectsStudentLoaderObject> {
    const projects: CompleteProject[] = await projectsLoader(teacherStudentRole.STUDENT);
    return {projects};
}