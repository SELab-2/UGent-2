import {SUBMISSION_STATE} from "./ApiInterfaces.ts";

export interface Backend_Course {
    id: number,
    name: string,
    archived: boolean,
}

export interface Backend_Project {
    id: number,
    name: string,
    deadline: string | Date,
    archived: boolean,
    description: string,
    requirements: string,
    visible: boolean,
    max_students: number,
    dockerfile: string,
    course_id: number,
}

export interface Backend_submission {
    date_time: string | Date,
    state: SUBMISSION_STATE,
    message: string,
    filename: string,
    id: number,
    group_id: number,
    student_id: number,
}

export interface Backend_group {
    id: number,
    project_id: number
}

export interface Backend_user {
    id: number,
    name: string,
    email: string,
    language: string,
    roles: string[]
}