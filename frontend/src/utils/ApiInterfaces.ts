import {GroupInfo} from "../dataloaders/ProjectsStudentLoader.ts";

export interface Course {
    course_id: number,
    course_name: string,
    course_archived: boolean
}

export interface Project {
    project_id: number,
    project_name: string,
    project_deadline: string | Date,
    project_archived: boolean,
    project_description: string,
    project_requirements: string,
    project_visible: boolean,
    project_max_students: number,
    project_dockerfile: string,
    course_id: number,
}


export enum SUBMISSION_STATE {
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

export interface Submission {
    submission_id: number
    submission_date: string | Date,
    submission_group_id: number,
    submission_student_id: number,
    submission_state: SUBMISSION_STATE,
    submission_message: string,
    submission_filename: string
}

export interface Group {
    group_id: number,
    project_id: number
}

export interface CompleteProject extends Project, Course {
}

export interface CompleteProjectStudent extends CompleteProject {
    group_id: number,
    groups_info: GroupInfo[] | undefined,
    submission_state: SUBMISSION_STATE,
    submission_student_id: number | undefined,
    group_members: User[],
    submission_file: string
}

export interface CompleteProjectTeacher extends CompleteProject {
    submission_amount: number,
    groups_info: GroupInfo[] | undefined,
    courses: Course[],
    submission_statistics: { [key: number]: number }
}

export interface SmallProjectInfo {
    project_id: number,
    project_name: string,
    project_deadline: Date | string,
    project_archived: boolean,
    project_visible: boolean,
}

export interface properCourse extends Course {
    active_projects: number,
    first_deadline: Date | null | string,
    all_projects: SmallProjectInfo[] | null,
    teachers: SmallUserInfo[],
    students: SmallUserInfo[]
}

export interface SmallUserInfo {
    name: string,
    email: string,
    user_id: number,
    course_id: number,
}

export interface CourseLoaderObject {
    course?: properCourse
}

export enum teacherStudentRole {
    STUDENT = "student",
    TEACHER = "teacher"
}

export interface Token {
    token?: string
}

export interface User {
    user_id: number,
    user_name: string,
    user_email: string,
    user_language: string,
    user_roles: string[]
}