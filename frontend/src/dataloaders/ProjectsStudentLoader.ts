import {CompleteProjectStudent, Group, Submission, SUBMISSION_STATE, User} from "../utils/ApiInterfaces.ts";
import {getAllProjectsAndSubjects, teacherStudentRole} from "./loader_helpers/SharedFunctions.ts";
import apiFetch from "../utils/ApiFetch.ts";
import {Backend_group, Backend_submission, Backend_user} from "../utils/BackendInterfaces.ts";
import {mapGroup, mapSubmission, mapUser} from "../utils/ApiTypesMapper.ts";

export const PROJECTS_STUDENT_ROUTER_ID = "projects_student";

export interface projectsStudentLoaderObject {
    projects: CompleteProjectStudent[]
}

export interface groupInfo {
    group_id: number;
    project_id: number;
    member_ids: memberInfo[];
    users?: User[];
}

export interface memberInfo {
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

    const project_ids = projects.map(project => project.project_id);

    const apiGroups = project_ids.map(async project_id => {
        const apiGroupData = await apiFetch<Backend_group>(`/projects/${project_id}/group`);
        if (!apiGroupData.ok){
            // TODO: error handling
        }
        const apiGroup = apiGroupData.content;
        if (apiGroup) {
            return mapGroup(apiGroup);
        }
        return null;
    })

    const groups = (await Promise.all(apiGroups))
    const groups_without_null = groups.filter(group => group !== null) as Group[];
    const group_ids = groups_without_null.map(group => group?.group_id);

    const submissionPromises: Promise<Submission>[] = group_ids.map(async group_id => {
        const apiSubmission = await apiFetch<Backend_submission>(`/groups/${group_id}/submission`);
        if (!apiSubmission.ok) {
            // TODO error handling
        }
        return mapSubmission(apiSubmission.content);
    });

    const submissions: Submission[] = (await Promise.all(submissionPromises));

    const groupMemberIdsPromises: Promise<groupInfo>[] = groups_without_null.map(async group => {
        const membersData = await apiFetch<memberInfo[]>(`/groups/${group.group_id}/members`)
        if (!membersData.ok) {
            // TODO error handling
        }
        const members = membersData.content;
        return {group_id: group.group_id, project_id: group.project_id, member_ids: members};
    });

    const groupMemberInfo: groupInfo[] = (await Promise.all(groupMemberIdsPromises));

    const groupMembersPromises: Promise<groupInfo>[] = groupMemberInfo.map(async (groupinfo) => {
        const memberPromises = groupinfo.member_ids.map(async (memberId) => {
            const apiMemberData = await apiFetch<Backend_user>(`/users/${memberId.id}`);
            if (!apiMemberData.ok) {
                // TODO error handling
            }
            return mapUser(apiMemberData.content);
        });
        const users = await Promise.all(memberPromises);
        return {
            group_id: groupinfo.group_id,
            project_id: groupinfo.project_id,
            member_ids: groupinfo.member_ids,
            users: users
        };
    });

    const groupMembers: (groupInfo)[] = await Promise.all(groupMembersPromises);

    return projects.map((project) => {
        const group = groupMembers.find(group => group.project_id === project.project_id);
        const submission = submissions.find(submission => submission.submission_group_id === group?.group_id);
        const subject = subjects.find(subject => subject.subject_id === project.subject_id);
        if (!subject) {
            throw Error("Subject not found for project.");
        }
        return {
            ...project,
            ...subject,
            submission_state: submission?.submission_state ?? SUBMISSION_STATE.Pending,
            submission_file: submission?.submission_filename ?? "",
            submission_student_id: submission?.submission_student_id,
            group_members: groupMembers.find(group => group.project_id == project.project_id)?.users ?? [],

        }
    })
}