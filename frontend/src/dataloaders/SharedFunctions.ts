import {Project, Subject} from "../utils/ApiInterfaces.ts";
import apiFetch, {ApiFetchResponse} from "../utils/ApiFetch.ts";
import {Backend_Project, Backend_Subject} from "../utils/BackendInterfaces.ts";
import {mapProjectList, mapSubjectList} from "../utils/ApiTypesMapper.ts";

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
        const subject: Subject | undefined = subjects.find(subject => subject.subject_id === projects[i].subject_id);
        if (subject !== undefined) {
            projects[i].subject_name = subject.subject_name;
        }
    }
    return projects;
}

export interface projectsAndSubjects {
    projects: Project[],
    subjects: Subject[]
}

export async function getAllProjectsAndSubjects(role: teacherStudentRole): Promise<projectsAndSubjects> {
    let projects: Project[] = [];
    let subjects: Subject[] = [];

    const projectsData: ApiFetchResponse<Backend_Project[]> = (await apiFetch<Backend_Project[]>(`/${role}/projects`));
    const subjectsData: ApiFetchResponse<Backend_Subject[]> = (await apiFetch<Backend_Subject[]>(`/${role}/subjects`));

    if (projectsData.ok){
        projects = mapProjectList(projectsData.content)
    }

    if (subjectsData.ok){
        subjects = mapSubjectList(subjectsData.content)
    }

    return {projects, subjects}
}
