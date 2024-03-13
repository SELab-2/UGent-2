import {Project, Subject} from "../utils/ApiInterfaces.ts";
import apiFetch from "../utils/ApiFetch.ts";

export enum teacherStudentRole {
    STUDENT = "student",
    TEACHER = "teacher"
}

export async function projectsLoader(role: teacherStudentRole): Promise<Project[]> {
    const getter = await getAllProjectsAndSubjects(role);
    const subjects = getter.subjects;
    const projects = getter.projects;
    // TODO: add submission data
    for (let i = 0; i < projects.length; i++) {
        const subject: Subject | undefined = subjects.find(subject => subject.id === projects[i].subject_id);
        if (subject !== undefined) {
            projects[i].subject_name = subject.name;
        }
    }
    return projects;
}

export interface projectsAndSubjects {
    projects: Project[],
    subjects: Subject[]
}

export async function getAllProjectsAndSubjects(role: teacherStudentRole): Promise<projectsAndSubjects> {
    const projects: Project[] = await (await apiFetch(`/${role}/projects`)).json() as Project[];
    const subjects: Subject[] = await (await apiFetch(`/${role}/subjects`)).json() as Subject[];
    return {projects, subjects}
}
