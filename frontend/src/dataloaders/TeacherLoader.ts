import {CompleteProjectTeacher} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForTeacher} from "./ProjectsTeacherLoader.ts";

export interface teacherLoaderObject {
    projects: CompleteProjectTeacher[]
}

export const TEACHER_ROUTER_ID = "teacher";

export default async function teacherLoader(): Promise<teacherLoaderObject> {
    const projects: CompleteProjectTeacher[] = await LoadProjectsForTeacher(true);
    return {projects};
}