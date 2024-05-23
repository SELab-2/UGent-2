export interface ProjectInput{
    name: string,
    deadline: string,
    archived: boolean,
    description: string,
    requirements: string,
    visible: boolean,
    max_students: number,
    dockerfile: string
}

export interface CourseInput{
    name: string;
    archived: boolean
}
