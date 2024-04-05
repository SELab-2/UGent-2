import {CompleteProject} from "../utils/ApiInterfaces.ts";
import {projectsLoader, teacherStudentRole} from "./SharedFunctions.ts";

export interface projectsTeacherLoaderObject {
    projects: CompleteProject[]
}

export const PROJECTS_TEACHER_ROUTER_ID = "projects_teacher";

export default async function projectsTeacherLoader(): Promise<projectsTeacherLoaderObject> {
    const projects: CompleteProject[] = await projectsLoader(teacherStudentRole.TEACHER);
    return {projects};
}