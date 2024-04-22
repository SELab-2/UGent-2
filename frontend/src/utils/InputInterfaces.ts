import {Value} from "../types/project.ts";

export interface ProjectInput{
    name: string,
    deadline: Value,
    archived: boolean,
    description: string,
    requirements: string,
    visible: boolean,
    max_students: number,
}

export interface CourseInput{
    name: string;
    archived: boolean
}
