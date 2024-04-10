import {CompleteProject} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForStudent} from "./ProjectsStudentLoader.ts";


export const PROJECT_STUDENT = "project_student";

export interface ProjectStudentLoaderObject {
    project?: CompleteProject
}

export default async function projectStudentLoader(project_id?: string): Promise<ProjectStudentLoaderObject> {
    if (!project_id || isNaN(parseInt(project_id))) {
        return {project: undefined};
    }
    const id = parseInt(project_id);
    return {project: (await LoadProjectsForStudent(false, id)).find(() => true)};
}