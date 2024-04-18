import {Group, Project, Subject, Submission, User} from "./ApiInterfaces.ts";
import {
    Backend_group,
    Backend_Project,
    Backend_Subject,
    Backend_submission,
    Backend_user
} from "./BackendInterfaces.ts";

export function mapSubjectList(subjectList: Backend_Subject[]): Subject[] {
    if (!Array.isArray(subjectList)) {
        throw new Error('projectList is not an array');
    }
    return subjectList.map(subjectData => ({
        subject_id: subjectData.id,
        subject_name: subjectData.name,
    }));
}

export function mapProjectList(projectList: Backend_Project[]): Project[] {
    return projectList.map(projectData => ({
        project_id: projectData.id,
        project_name: projectData.name,
        project_deadline: projectData.deadline,
        project_archived: projectData.archived,
        project_description: projectData.description,
        project_requirements: projectData.requirements,
        project_visible: projectData.visible,
        project_max_students: projectData.max_students,
        subject_id: projectData.subject_id,
    }));
}

export function mapSubmission(submission: Backend_submission): Submission {
    return {
        submission_id: submission.id,
        submission_date: submission.date_time,
        submission_group_id: submission.group_id,
        submission_student_id: submission.student_id,
        submission_state: submission.state,
        submission_message: submission.message,
        submission_filename: submission.filename,
    };
}

export function mapUser(user: Backend_user): User {
    return {
        user_id: user.id,
        user_name: user.name,
        user_roles: user.roles,
        user_email: user.email,
        user_language: user.language
    };
}

export function mapGroup(group: Backend_group): Group {
    return {
        group_id: group.id,
        project_id: group.project_id
    };
}

export function mapGroupList(groupList: Backend_group[]): Group[] {
    return groupList.map(groupData => ({
        group_id: groupData.id,
        project_id: groupData.project_id,
    }));
}


