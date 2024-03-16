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

export interface Token {
    token?: string
}

export default interface User {
    id: number,
    name: string,
    email: string,
    roles: string[]
}