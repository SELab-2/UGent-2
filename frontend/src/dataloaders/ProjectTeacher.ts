import {CompleteProjectTeacher} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForTeacher} from "./projectsTeacherLoader.ts";


export const PROJECT_TEACHER= "project_student";

export interface ProjectStudentLoaderObject {
    project?: CompleteProjectTeacher
}

export default async function projectTeacherLoader(project_id?: string): Promise<ProjectStudentLoaderObject> {
    if (!project_id || isNaN(parseInt(project_id))) {
        return {project: undefined};
    }
    const id = parseInt(project_id);
    return {project: (await LoadProjectsForTeacher(false, id)).find(() => true)};
}