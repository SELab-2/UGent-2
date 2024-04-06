export interface Subject {
    id: number,
    name: string
}

export interface Project {
    id: number,
    name: string,
    deadline: string | Date,
    archived: boolean,
    description: string,
    requirements: string,
    visible: string,
    max_students: number,
    subject_id: number,
    subject_name: string | undefined | null
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

export interface properSubject extends Subject {
    active_projects: number,
    first_deadline: Date | null | string
}

export interface Token {
    token?: string
}

export interface User {
    id: number,
    name: string,
    email: string,
    roles: string[]
}