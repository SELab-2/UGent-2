import {CompleteProject} from "../utils/ApiInterfaces.ts";
import {projectsLoader, teacherStudentRole} from "./SharedFunctions.ts";

export interface studentLoaderObject {
    projects: CompleteProject[]
}

export const STUDENT_ROUTER_ID = "student";


export default async function studentLoader(): Promise<studentLoaderObject> {
    const projects: CompleteProject[] = await projectsLoader(teacherStudentRole.STUDENT);
    return {projects};
}