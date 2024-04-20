import {Course} from "../utils/ApiInterfaces.ts";

export type ValuePiece = Date | null; // nodig voor de deadline
export type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline

export type ProjectTeacher = {
    projectName: string,
    all_courses: Course[],
    courseName: string,
    hours: number,
    minutes: number,
    deadline: Value,
    description: string,
    requiredFiles: string,
    otherFilesAllow: boolean,
    groupProject: boolean,
    maxGroupMembers: number
}

export enum ProjectStatus {
    PENDING = "Pending",
    FAILED = "Failed",
    SUCCESS = "Succes",
}

export type ProjectStudent = {
    projectName: string,
    courseName: string,
    deadline: string,
    status: ProjectStatus,
    description: string,
    requiredFiles: object,
    groupMembers: {
        name: string,
        email: string,
        lastSubmission: boolean
    }[] | undefined,
    maxGroupMembers: number,
    submission: string | null
}
