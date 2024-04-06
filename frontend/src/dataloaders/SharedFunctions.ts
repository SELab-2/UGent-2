import {CompleteProject, Group, Project, properSubject, Subject, Submission} from "../utils/ApiInterfaces.ts";
import apiFetch from "../utils/api/ApiFetch.ts";

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

export async function projectsLoader(role: teacherStudentRole): Promise<CompleteProject[]> {
    const {subjects, projects} = await getAllProjectsAndSubjects(role);
    if (! Array.isArray(projects) || ! Array.isArray(subjects)) {
        throw Error("Problem loading projects or courses.");
    }
    const submissions: Submission[] = await Promise.all(projects.map(project => {
        return getSubmissionForProject(project.project_id);
    }));
    return projects.map((project, index) => {
        const subject = subjects.find(subject => subject.id === project.subject_id);
        if (subject === undefined) {
            throw Error("there should always be a subject for a project");
        }
        return {
            ...project,
            ...subject,
            ...submissions[index]
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

export async function getSubmissionForProject(project_id: number): Promise<Submission> {
    const group: Group = (await apiFetch(`/projects/${project_id}/group`)) as Group;
    return (await apiFetch(`/groups/${group.group_id}/submission`)) as Submission;
}
