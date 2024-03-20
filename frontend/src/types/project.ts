import React from "react";

type ValuePiece = Date | null; // nodig voor de deadline
type Value = ValuePiece | [ValuePiece, ValuePiece]; // nodig voor de deadline

export type Project = {
    projectName: string, setProjectName: React.Dispatch<React.SetStateAction<string>>,
    courseName: string, setCourseName: React.Dispatch<React.SetStateAction<string>>,
    hours: string, setHours: React.Dispatch<React.SetStateAction<string>>, //TODO dit aanpassen naar number
    minutes: string, setMinutes: React.Dispatch<React.SetStateAction<string>>, //TODO dit aanpassen naar number
    deadline: Value, setDeadline: React.Dispatch<React.SetStateAction<Value>>, // TODO dit aanpassen naar Date of iets anders
    description: string, setDescription: React.Dispatch<React.SetStateAction<string>>,
    requiredFiles: string, setRequiredFiles: React.Dispatch<React.SetStateAction<string>>,
    otherFilesAllow: boolean, setOtherFilesAllow: React.Dispatch<React.SetStateAction<boolean>>,
    groupProject: boolean, setGroupProject: React.Dispatch<React.SetStateAction<boolean>>
}