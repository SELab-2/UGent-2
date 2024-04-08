import {CompleteProjectTeacher} from "../utils/ApiInterfaces.ts";
import {LoadProjectsForTeacher} from "./projectsTeacherLoader.ts";


export const PROJECT_TEACHER= "project_student";

export interface ProjectStudentLoaderObject {
    project?: CompleteProjectTeacher
    found: boolean
}

// TODO: aan router toevoegen wanneer emma haar branch is gemerged
export default async function ProjectTeacherLoader(project_id: number): Promise<ProjectStudentLoaderObject> {
    const projects = await LoadProjectsForTeacher(false, project_id)
    if (projects.length === 0) {
        return {project: undefined, found: false};
    }
    return {project: projects[0], found: true};
}