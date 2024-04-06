import {CompleteProject, Group, Submission} from "../utils/ApiInterfaces.ts";
import {getAllProjectsAndSubjects, projectsLoader, teacherStudentRole} from "./SharedFunctions.ts";
import
import apiFetch from "../utils/ApiFetch.ts";

export const PROJECTS_STUDENT_ROUTER_ID = "projects_student";

export interface projectsStudentLoaderObject {
    projects: CompleteProject[]
}

export default async function projectsStudentLoader(): Promise<projectsStudentLoaderObject> {
    const projects: CompleteProject[] = await projectsLoader(teacherStudentRole.STUDENT);
    return {projects};
}

export async function projectsLoaderStudent(): Promise<CompleteProject[]> {
    const {subjects, projects} = await getAllProjectsAndSubjects(role);
    if (!Array.isArray(projects) || !Array.isArray(subjects)) {
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
