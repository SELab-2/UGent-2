import {CompleteProjectStudent} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForStudent} from "./ProjectsStudentLoader.ts";

export interface studentLoaderObject {
    projects: CompleteProjectStudent[]
}

export const STUDENT_ROUTER_ID = "student";

export default async function studentLoader(): Promise<studentLoaderObject> {
    const projects: CompleteProjectStudent[] = await LoadProjectsForStudent(true);
    return {projects};
}