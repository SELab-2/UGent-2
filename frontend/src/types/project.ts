import {Course} from "../utils/ApiInterfaces.ts";
import {GroupInfo} from "../dataloaders/ProjectsStudentLoader.ts";

export type ValuePiece = Date | null; // nodig voor de deadline
export type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline

export type ProjectTeacher = {
    projectId: number,
    projectName: string,
    all_courses: Course[],
    courseName: string,
    hours: number,
    minutes: number,
    deadline: Value,
    visible: boolean,
    archived: boolean,
    description: string,
    requiredFiles: object,
    otherFilesAllow: boolean,
    groupProject: boolean,
    maxGroupMembers: number,
    dockerFile: string,
    amount_groups: number
}

export enum ProjectStatus {
    PENDING = "Pending",
    FAILED = "Failed",
    SUCCESS = "Succes",
}

export type ProjectStudent = {
    projectId: number,
    projectName: string,
    courseName: string,
    deadline: string,
    status: ProjectStatus,
    description: string,
    requiredFiles: object,
    group_id: number,
    groups_info: GroupInfo[] | undefined,
    groupMembers: {
        name: string,
        email: string,
        lastSubmission: boolean
    }[] | undefined,
    maxGroupMembers: number,
    submission: string | null
}
