import {CompleteProjectStudent, Group, Submission, SUBMISSION_STATE, User} from "../utils/ApiInterfaces.ts";
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

    filter_on_current = project_id ? false : filter_on_current;

    const temp = await getAllProjectsAndSubjects(teacherStudentRole.STUDENT, filter_on_current);
    const subjects = temp.subjects;
    let projects = temp.projects;

    if (!Array.isArray(projects) || !Array.isArray(subjects)) {
        throw new Error("Problem loading projects or courses.");
    }

    if (project_id) {
        projects = projects.filter(project => project.project_id === project_id);
    }

    const groupPromises: Promise<Group | undefined>[] = projects.map(async project => {
        const apiGroup = await apiFetch(`/projects/${project.project_id}/group`) as Backend_group;
        return apiGroup ? mapGroup(apiGroup) : undefined;
    });

    const submissionPromises: Promise<Submission | undefined>[] = groupPromises.map(async groupPromise => {
        const group = await groupPromise;
        return group ? mapSubmission(await apiFetch(`/groups/${group.group_id}/submission`) as Backend_submission) : undefined;
    });

    const groupMemberIdsPromises: Promise<member[] | undefined>[] = groupPromises.map(async groupPromise => {
        const group = await groupPromise;
        return group ? await apiFetch(`/groups/${group.group_id}/members`) as member[] : undefined;
    });

    const groupMembersPromises: Promise<(User | undefined)[]>[] = groupMemberIdsPromises.map(async memberIdsPromise => {
        const memberIds = await memberIdsPromise;
        return memberIds ? Promise.all(memberIds.map(async memberId => mapUser(await apiFetch(`/users/${memberId.id}`) as Backend_user))) : [];
    });

    const [submissions, groupMembers] = await Promise.all([
        Promise.all(submissionPromises),
        Promise.all(groupMembersPromises)
    ]);

    const completeProjects: CompleteProjectStudent[] = projects.map((project, index) => {
        const submission = submissions[index];
        const subject = subjects.find(subject => subject.subject_id === project.subject_id);
        if (!subject) {
            throw new Error("Subject not found for project.");
        }
        return {
            ...project,
            ...subject,
            submission_state: submission?.submission_state ?? SUBMISSION_STATE.Pending,
            submission_student_id: submission?.submission_student_id,
            group_members: groupMembers[index],
            submission_file: submission?.submission_filename ?? ""
        };
    });

    return completeProjects.filter(project => project.submission_state !== undefined);
}
