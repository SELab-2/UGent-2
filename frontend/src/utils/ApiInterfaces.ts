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
    subject_name?: string
}

export interface properSubject {
    id: number,
    name: string,
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