import {CompleteProject} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForStudent} from "./ProjectsStudentLoader.ts";

export interface studentLoaderObject {
    projects: CompleteProject[]
}

export const STUDENT_ROUTER_ID = "student";

export default async function studentLoader(): Promise<studentLoaderObject> {
    const projects: CompleteProject[] = await LoadProjectsForStudent(true);
    return {projects};
}