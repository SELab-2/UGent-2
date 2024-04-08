export interface Subject {
    subject_id: number,
    subject_name: string
}

export interface Project {
    project_id: number,
    project_name: string,
    project_deadline: string | Date,
    project_archived: boolean,
    project_description: string,
    project_requirements: string,
    project_visible: boolean,
    project_max_students: number,
    subject_id: number,
}


export enum SUBMISSION_STATE {
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

export interface Submission {
    submission_id: number
    submission_date: string | Date,
    submission_group_id: number,
    submission_student_id: number,
    submission_state: SUBMISSION_STATE,
    submission_message: string,
    submission_filename: string
}

export interface Group {
    group_id: number,
    project_id: number
}

export interface CompleteProject extends Project, Subject {
    submission_state: SUBMISSION_STATE,
}

export interface CompleteProjectTeacher extends Project, Subject {
    submission_amount: number,
}

export interface properSubject extends Subject {
    active_projects: number,
    first_deadline: Date | null | string
}

export interface Token {
    token?: string
}

export interface User {
    user_id: number,
    user_name: string,
    user_email: string,
    user_language: string,
    user_roles: string[]
}