import {CompleteProjectStudent} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForStudent} from "./ProjectsStudentLoader.ts";
import projectRoleLoader from "./loader_helpers/ProjectHelper.ts";


export const PROJECT_STUDENT = "project_student";

export interface ProjectStudentLoaderObject {
    project?: CompleteProjectStudent
}

export default async function projectStudentLoader(project_id?: string): Promise<ProjectStudentLoaderObject> {
    return projectRoleLoader(LoadProjectsForStudent, project_id);
}