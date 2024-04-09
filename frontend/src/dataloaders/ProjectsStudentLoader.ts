import {CompleteProject, Group, Submission} from "../utils/ApiInterfaces.ts";
import {getAllProjectsAndSubjects, teacherStudentRole} from "./SharedFunctions.ts";
import apiFetch from "../utils/api/ApiFetch.ts";
import {Backend_group, Backend_submission} from "../utils/BackendInterfaces.ts";
import {mapGroup, mapSubmission} from "../utils/ApiTypesMapper.ts";

export const PROJECTS_STUDENT_ROUTER_ID = "projects_student";

export interface projectsStudentLoaderObject {
    projects: CompleteProject[]
}

export default async function projectsStudentLoader(): Promise<projectsStudentLoaderObject> {
    const projects: CompleteProject[] = await LoadProjectsForStudent();
    return {projects};
}

export async function LoadProjectsForStudent(): Promise<CompleteProject[]> {
    const {subjects, projects} = await getAllProjectsAndSubjects(teacherStudentRole.STUDENT);
    if (!Array.isArray(projects) || !Array.isArray(subjects)) {
        throw Error("Problem loading projects or courses.");
    }

    //TODO aanpassen, dit geeft gelijk alle groepen terug
    const groupPromises: Promise<Group | undefined>[] = projects.map(async project => {
        const apiGroup = await apiFetch(`/projects/${project.project_id}/group`) as Backend_group;
        if (apiGroup) {
            return mapGroup(apiGroup);
        } else return undefined;
    });

    const submissionPromises: Promise<Submission | undefined>[] = (await Promise.all(groupPromises)).map(async group => {
        if (group) {
            const apiSubmission = await apiFetch(`/groups/${group.group_id}/submission`) as Backend_submission;
            return mapSubmission(apiSubmission);
        }
        return undefined;
    });

    const submissions: Submission[] = (await Promise.all(submissionPromises)) as Submission[];

    return projects.map((project, index) => {
        const submission = submissions[index];
        const subject = subjects.find(subject => subject.subject_id === project.subject_id);
        if (!subject) {
            throw Error("Subject not found for project.");
        }
        return {
            ...project,
            ...subject,
            submission_state: submission?.submission_state,
        }
    }).filter(project => project.submission_state !== undefined); // filter alles eruit waar je niets mee te maken hebt
}
