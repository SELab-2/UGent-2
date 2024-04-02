export type ValuePiece = Date | null; // nodig voor de deadline
export type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline

export type ProjectTeacher = {
    projectName: string,
    courseName: string,
    hours: number,
    minutes: number,
    deadline: Value, // TODO dit aanpassen naar Date of iets anders
    description: string,
    requiredFiles: string,
    otherFilesAllow: boolean,
    groupProject: boolean,
}

export enum ProjectStatus {
    FAILED = "Failed",
    SUCCESS = "Succes",
}

export type ProjectStudent = {
    projectName: string,
    courseName: string,
    deadline: string,
    status: ProjectStatus,
    description: string,
    requiredFiles: string[],
    groupMembers: {
        name: string,
        email: string,
        lastSubmission: boolean
    }[],
    maxGroupMembers: number,
    submission: string | null
}
