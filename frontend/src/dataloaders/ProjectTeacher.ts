import {CompleteProjectTeacher} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForTeacher} from "./ProjectsTeacherLoader.ts";
import projectRoleLoader from "./loader_helpers/ProjectHelper.ts";


export const PROJECT_TEACHER= "project_teacher";

export interface ProjectTeacherLoaderObject {
    project?: CompleteProjectTeacher
}

export default async function projectTeacherLoader(project_id?: string): Promise<ProjectTeacherLoaderObject> {
    return projectRoleLoader(LoadProjectsForTeacher, project_id);
}