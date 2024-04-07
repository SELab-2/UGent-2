import {SUBMISSION_STATE} from "./ApiInterfaces.ts";

export interface Backend_Subject {
    id: number,
    name: string
}

export interface Backend_Project {
    id: number,
    name: string,
    deadline: string | Date,
    archived: boolean,
    description: string,
    requirements: string,
    visible: string,
    max_students: number,
    subject_id: number,
}

export interface Backend_submission {
    id: number,
    date: string | Date,
    group_id: number,
    student_id: number,
    state: SUBMISSION_STATE,
    message: string,
    filename: string,
}

export interface Backend_group {
    id: number,
    project_id: number
}