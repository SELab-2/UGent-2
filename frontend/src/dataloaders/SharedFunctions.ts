import {Project, properSubject, Subject} from "../utils/ApiInterfaces.ts";
import apiFetch from "../utils/ApiFetch.ts";

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
        const subjectProjects = projects.filter(project => project.subject_id === subject.id);
        if (subjectProjects.length === 0) {
            return {
                active_projects: 0,
                first_deadline: null,
                id: subject.id,
                name: subject.name
            };
        }
        const shortestDeadlineProject = subjectProjects.reduce((minProject, project) => {
            if (project.deadline < minProject.deadline) {
                return project;
            } else {
                return minProject;
            }
        });
        const firstDeadline = shortestDeadlineProject.deadline;
        return {
            active_projects: subjectProjects.length,
            first_deadline: firstDeadline,
            id: subject.id,
            name: subject.name
        }
    });
}

export interface projectsAndSubjects {
    projects: Project[],
    subjects: Subject[]
}

export async function getAllProjectsAndSubjects(role: teacherStudentRole): Promise<projectsAndSubjects> {
    const projects: Project[] = (await apiFetch(`/${role}/projects`)) as Project[];
    const subjects: Subject[] = (await apiFetch(`/${role}/subjects`)) as Subject[];
    return {projects, subjects}
}
