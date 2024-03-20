import React from "react";

type StateSetter<Type> = React.Dispatch<React.SetStateAction<Type>>;
type ValuePiece = Date | null; // nodig voor de deadline
type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline

export type ProjectTeacher = {
    projectName: string, setProjectName: StateSetter<string>,
    courseName: string, setCourseName: StateSetter<string>,
    hours: string, setHours: StateSetter<string>, //TODO dit aanpassen naar number
    minutes: string, setMinutes: StateSetter<string>, //TODO dit aanpassen naar number
    deadline: Value, setDeadline: StateSetter<Value>, // TODO dit aanpassen naar Date of iets anders
    description: string, setDescription: StateSetter<string>,
    requiredFiles: string, setRequiredFiles: StateSetter<string>,
    otherFilesAllow: boolean, setOtherFilesAllow: StateSetter<boolean>,
    groupProject: boolean, setGroupProject: StateSetter<boolean>
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