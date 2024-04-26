import {properCourse, teacherStudentRole} from "../utils/ApiInterfaces.ts";
import {coursesLoader} from "./loader_helpers/SharedFunctions.ts";

export interface coursesTeacherLoaderObject {
    courses: properCourse[]
}

export const CREATE_PROJECT_TEACHER_ID = "create_project_teacher";
export const COURSES_TEACHER_ROUTER_ID = "courses_teacher";

export default async function coursesTeacherLoader(): Promise<coursesTeacherLoaderObject> {
    const courses: properCourse[] = await coursesLoader(teacherStudentRole.TEACHER);
    return {courses};
}