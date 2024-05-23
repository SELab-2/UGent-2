import {
    CompleteProjectStudent,
    Group,
    Submission,
    SUBMISSION_STATE,
    teacherStudentRole,
    User
} from "../utils/ApiInterfaces.ts";
import {getAllProjectsAndCourses, getGroupInfo} from "./loader_helpers/SharedFunctions.ts";
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
    members: Backend_user[];
    users?: User[];
}

export interface GroupInfo {
    id: number,
    member_count: number,
    visible_id: number
}

export default async function projectsStudentLoader(): Promise<projectsStudentLoaderObject> {
    const projects: CompleteProjectStudent[] = await LoadProjectsForStudent();
    return {projects};
}

export async function LoadProjectsForStudent(filter_on_current: boolean = false, project_id?: number): Promise<CompleteProjectStudent[]> {
    if (project_id) {
        filter_on_current = false;
    }
    const temp = await getAllProjectsAndCourses(teacherStudentRole.STUDENT, filter_on_current);
    const courses = temp.courses;
    let projects = temp.projects;

    if (!Array.isArray(projects) || !Array.isArray(courses)) {
        throw Error("Problem loading projects or courses.");
    }

    if (project_id) {
        projects = projects.filter(project => project.project_id === project_id);
    }

    const project_ids = projects.map(project => project.project_id);

    const apiGroups = project_ids.map(async project_id => {
        const apiGroupData = await apiFetch<Backend_group>(`/projects/${project_id}/group`);
        if (apiGroupData.ok && apiGroupData.content) {
            return mapGroup(apiGroupData.content)
        }
        return undefined;
    })

    const groups = await Promise.all(apiGroups)
    const groups_without_null = groups.filter(group => group !== undefined) as Group[];
    const group_ids = groups_without_null.map(group => group?.group_id);

    const submissionPromises: Promise<Submission | undefined>[] = group_ids.map(async group_id => {
        const apiSubmission = await apiFetch<Backend_submission>(`/groups/${group_id}/submission`);
        if (apiSubmission.ok) {
            return mapSubmission(apiSubmission.content);
        }
        return undefined
    });

    const all_submissions: (Submission | undefined)[] = (await Promise.all(submissionPromises));
    const submissions = all_submissions.filter(sub => sub !== undefined) as Submission[]
    const groupBackendMembersPromises: Promise<groupInfo | undefined>[] = groups_without_null.map(async group => {
        const membersData = await apiFetch<Backend_user[]>(`/groups/${group.group_id}/members`)
        if (membersData.ok) {
            const members = membersData.content;
            return {group_id: group.group_id, project_id: group.project_id, members: members};
        }
        return undefined;
    });

    const all_groupMemberInfo: (groupInfo | undefined)[] = (await Promise.all(groupBackendMembersPromises));
    const groupMemberInfo: groupInfo[] = all_groupMemberInfo.filter(gmi => gmi !== undefined) as groupInfo[]
    const allGroupMembers: groupInfo[] = groupMemberInfo.map((groupinfo) => {
        const all_users: User[] = groupinfo.members.map((member) => {
            return mapUser(member);
        });
        const users: User[] = all_users.filter(user => user != undefined)
        return {
            group_id: groupinfo.group_id,
            project_id: groupinfo.project_id,
            members: groupinfo.members,
            users: users
        };
    });

    const groupMembers = allGroupMembers.filter(gm => gm !== undefined)
    return await Promise.all(projects.map(async (project) => {
        const groupInfo = await getGroupInfo(project.project_id)
        const group = groupMembers.find(group => group.project_id === project.project_id) as groupInfo;
        const group_id = group ? group.group_id : -1
        const submission = submissions.find(submission => submission.submission_group_id === group?.group_id);
        const course = courses.find(course => course.course_id === project.course_id);
        if (!course) {
            throw Error("Course not found for project.");
        }
        return {
            ...project,
            ...course,
            group_id: group_id,
            groups_info: groupInfo,
            submission_state: submission?.submission_state ?? SUBMISSION_STATE.Pending,
            submission_file: submission?.submission_filename.split('/').reverse()[0] ?? "",
            submission_student_id: submission?.submission_student_id,
            group_members: groupMembers.find(group => group.project_id == project.project_id)?.users ?? [],
        }
    }))
}
