import {CompleteProject} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForStudent} from "./ProjectsStudentLoader.ts";


export const PROJECT_STUDENT = "project_student";

export interface ProjectStudentLoaderObject {
    project?: CompleteProject
    found: boolean
}

// TODO: aan router toevoegen wanneer emma haar branch is gemerged
export default async function ProjectStudentLoader(project_id: number): Promise<ProjectStudentLoaderObject> {
    const projects = await LoadProjectsForStudent(false, project_id)
    if (projects.length === 0) {
        return {project: undefined, found: false};
    }
    return {project: projects[0], found: true};
}