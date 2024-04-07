import {CompleteProjectTeacer} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForTeacher} from "./projectsTeacherLoader.ts";

export interface teacherLoaderObject {
    projects: CompleteProjectTeacer[]
}

export const TEACHER_ROUTER_ID = "teacher";

export default async function teacherLoader(): Promise<teacherLoaderObject> {
    const projects: CompleteProjectTeacer[] = (await LoadProjectsForTeacher())
        .filter(project => !project.project_archived && project.project_visible);
    return {projects};
}