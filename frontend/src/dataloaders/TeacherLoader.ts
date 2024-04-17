import {CompleteProjectTeacher, Project} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForTeacher} from "./projectsTeacherLoader.ts";

export interface teacherLoaderObject {
    projects: Project[]
}

export const TEACHER_ROUTER_ID = "teacher";

export default async function teacherLoader(): Promise<teacherLoaderObject> {
    const projects: CompleteProjectTeacher[] = await LoadProjectsForTeacher(true);
    return {projects};
}