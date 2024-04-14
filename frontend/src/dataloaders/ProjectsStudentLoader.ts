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
        const apiGroup = await apiFetch(`/projects/${project_id}/group`) as Backend_group;
        if (apiGroup) {
            return mapGroup(apiGroup);
        } else {
            return null
        }
    })

    const groups = (await Promise.all(apiGroups))
    const groups_without_null = groups.filter(group => group !== null) as Group[];
    const group_ids = groups_without_null.map(group => group?.group_id);

    const submissionPromises: Promise<Submission>[] = group_ids.map(async group_id => {
        const apiSubmission = await apiFetch(`/groups/${group_id}/submission`) as Backend_submission;
        return mapSubmission(apiSubmission);
    });

    const submissions: Submission[] = (await Promise.all(submissionPromises));

    const groupMemberIdsPromises: Promise<groupInfo>[] = groups_without_null.map(async group => {
        const members = await apiFetch(`/groups/${group.group_id}/members`) as memberInfo[]
        return {group_id: group.group_id, project_id: group.project_id, member_ids: members};
    });

    const groupMemberInfo: groupInfo[] = (await Promise.all(groupMemberIdsPromises));

    const groupMembersPromises: Promise<groupInfo>[] = groupMemberInfo.map(async (groupinfo) => {
        const memberPromises = groupinfo.member_ids.map(async (memberId) => {
            const apiMember = await apiFetch(`/users/${memberId.id}`) as Backend_user;
            return mapUser(apiMember);
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