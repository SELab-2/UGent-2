import {Project, properSubject, Subject} from "../utils/ApiInterfaces.ts";
import apiFetch from "../utils/ApiFetch.ts";
import {mapProjectList, mapSubjectList} from "../utils/ApiTypesMapper.ts";
import {Backend_Project, Backend_Subject} from "../utils/BackendInterfaces.ts";

export enum teacherStudentRole {
    STUDENT = "student",
    TEACHER = "teacher"
}

export async function coursesLoader(role: teacherStudentRole): Promise<properSubject[]> {
    const {subjects, projects} = await getAllProjectsAndSubjects(role);
    if (!Array.isArray(projects) || !Array.isArray(subjects)) {
        throw Error("Problem loading projects or courses.");
    }
    return subjects.map((subject) => {
        const subjectProjects = projects.filter(project => project.subject_id === subject.subject_id);
        if (subjectProjects.length === 0) {
            return {
                active_projects: 0,
                first_deadline: null,
                subject_id: subject.subject_id,
                subject_name: subject.subject_name
            };
        }
        const shortestDeadlineProject = subjectProjects.reduce((minProject, project) => {
            if (project.project_deadline < minProject.project_deadline) {
                return project;
            } else {
                return minProject;
            }
        });
        const firstDeadline = shortestDeadlineProject.project_deadline;
        return {
            active_projects: subjectProjects.length,
            first_deadline: firstDeadline,
            subject_id: subject.subject_id,
            subject_name: subject.subject_name
        }
    });
}

export interface projectsAndSubjects {
    projects: Project[],
    subjects: Subject[]
}

export async function getAllProjectsAndSubjects(role: teacherStudentRole, filter_on_current: boolean = false): Promise<projectsAndSubjects> {
    const apiSubjects = (await apiFetch(`/${role}/subjects`)) as Backend_Subject[];
    const apiProjects = (await apiFetch(`/${role}/projects`)) as Backend_Project[];
    let projects: Project[] = mapProjectList(apiProjects);
    if (filter_on_current) {
        projects = projects.filter(project => project.project_visible && !project.project_archived)
    }
    const subjects: Subject[] = mapSubjectList(apiSubjects);
    return {projects, subjects}
}
