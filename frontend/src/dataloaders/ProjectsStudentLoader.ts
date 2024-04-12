import {CompleteProjectStudent, Group, Submission, User} from "../utils/ApiInterfaces.ts";
import {getAllProjectsAndSubjects, teacherStudentRole} from "./loader_helpers/SharedFunctions.ts";
import apiFetch from "../utils/ApiFetch.ts";
import {Backend_group, Backend_submission, Backend_user} from "../utils/BackendInterfaces.ts";
import {mapGroup, mapSubmission, mapUser} from "../utils/ApiTypesMapper.ts";

export const PROJECTS_STUDENT_ROUTER_ID = "projects_student";

export interface projectsStudentLoaderObject {
    projects: CompleteProjectStudent[]
}

export interface member {
    id: number;
}

export default async function projectsStudentLoader(): Promise<projectsStudentLoaderObject> {
    const projects: CompleteProjectStudent[] = await LoadProjectsForStudent();
    return {projects};
}

export async function LoadProjectsForStudent(filter_on_current: boolean = false, project_id?: number): Promise<CompleteProjectStudent[]> {
    if (project_id) {
        filter_on_current = false;
    }
    const temp = await getAllProjectsAndSubjects(teacherStudentRole.STUDENT, filter_on_current);
    const subjects = temp.subjects;
    let projects = temp.projects;
    if (!Array.isArray(projects) || !Array.isArray(subjects)) {
        throw Error("Problem loading projects or courses.");
    }

    if (project_id) {
        projects = projects.filter(project => project.project_id === project_id);
    }

    //TODO aanpassen, dit geeft gelijk alle groepen terug
    const groupPromises: Promise<Group | undefined>[] = projects.map(async project => {
        const apiGroup = await apiFetch(`/projects/${project.project_id}/group`) as Backend_group;
        if (apiGroup) {
            return mapGroup(apiGroup);
        } else return undefined;
    });

    const groups: Group[] = (await Promise.all(groupPromises)) as Group[];

    const submissionPromises: Promise<Submission | undefined>[] = groups.map(async group => {
        if (group) {
            const apiSubmission = await apiFetch(`/groups/${group.group_id}/submission`) as Backend_submission;
            return mapSubmission(apiSubmission);
        }
        return undefined;
    });

    const groupMemberIdsPromises: Promise<member[] | undefined>[] = groups.map(async group => {
        if (group) {
            return await apiFetch(`/groups/${group.group_id}/members`) as member[]
        }
        return undefined;
    });

    const groupMembersIds: Awaited<member[] | undefined>[] = await Promise.all(groupMemberIdsPromises);

    const groupMembersPromises: Promise<(User | undefined)[]>[] = groupMembersIds.map(async (groupMemberIds) => {
        if (groupMemberIds) {
            const memberPromises = groupMemberIds.map(async (memberId) => {
                const apiMember = await apiFetch(`/users/${memberId.id}`) as Backend_user;
                return mapUser(apiMember);
            });
            return Promise.all(memberPromises);
        }
        return [];
    });

    const groupMembers: (User | undefined)[][] = await Promise.all(groupMembersPromises);

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
            submission_student_id: submission?.submission_student_id,
            group_members: groupMembers[index]

        }
    }).filter(project => project.submission_state !== undefined); // filter alles eruit waar je niets mee te maken hebt
}
