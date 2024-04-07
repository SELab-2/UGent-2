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

<<<<<<< HEAD
export async function projectsLoader(role: teacherStudentRole): Promise<CompleteProject[]> {
    const {subjects, projects} = await getAllProjectsAndSubjects(role);
    if (! Array.isArray(projects) || ! Array.isArray(subjects)) {
        throw Error("Problem loading projects or courses.");
    }

    //TODO aanpassen, dit geeft gelijk alle groepen terug
    const groupPromises: Promise<Group | undefined>[] = projects.map(async project => {
        return (await apiFetch(`/projects/${project.id}/group`)) as Group;
    });

    const submissionPromises: Promise<Submission | undefined>[] = (await Promise.all(groupPromises)).map(async group => {
        if (group) {
            return (await apiFetch(`/groups/${group.id}/submission`)) as Submission;
        }
        return undefined;
    });

    const groups: Group[] = (await Promise.all(groupPromises)).filter(group => group !== null) as Group[];
    const submissions: Submission[] = (await Promise.all(submissionPromises)) as Submission[];

    return projects.map((project, index) => {
        const group = groups[index];
        const submission = submissions[index];
        const subject = subjects.find(subject => subject.id === project.subject_id);
        if (!subject) {
            throw Error("Subject not found for project.");
        }
        return {
            ...project,
            ...group,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            submission_state: submission?.state
        }
    }).filter(project => project.submission_state !== undefined); // filter alles eruit waar je niets mee te maken hebt
}

=======
>>>>>>> d865193 (move project dataloader for student to other file)
export interface projectsAndSubjects {
    projects: Project[],
    subjects: Subject[]
}

export async function getAllProjectsAndSubjects(role: teacherStudentRole): Promise<projectsAndSubjects> {
    const apiSubjects = (await apiFetch(`/${role}/subjects`)) as Backend_Subject[];
    const apiProjects = (await apiFetch(`/${role}/projects`)) as Backend_Project[];
    const projects: Project[] = mapProjectList(apiProjects);
    const subjects: Subject[] = mapSubjectList(apiSubjects);
    return {projects, subjects}
}
