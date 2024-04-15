export interface Subject {
    subject_id: number,
    subject_name: string
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
    subject_id: number,
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

export interface CompleteProject extends Project, Subject {
}

export interface CompleteProjectStudent extends CompleteProject {
    submission_state: SUBMISSION_STATE,
    submission_student_id: number | undefined,
    group_members: User[],
    submission_file: string
}

export interface CompleteProjectTeacher extends CompleteProject {
    submission_amount: number,
    subjects: Subject[],
    submission_statistics: number[]
}

export interface SmallProjectInfo {
    project_id: number,
    project_name: string,
    project_deadline: Date | string,
    project_archived: boolean,
    project_visible: boolean,
}

export interface properSubject extends Subject {
    active_projects: number,
    first_deadline: Date | null | string,
    all_projects: SmallProjectInfo[] | null,
    teachers: TeacherInfo[]
}

export interface TeacherInfo {
    name: string,
    email: string,
    course_id: number,
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