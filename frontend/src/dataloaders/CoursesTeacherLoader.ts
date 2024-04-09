import {properSubject} from "../utils/ApiInterfaces.ts";
import {coursesLoader, teacherStudentRole} from "./SharedFunctions.ts";

export interface coursesTeacherLoaderObject {
    courses: properSubject[]
}

export const COURSES_TEACHER_ROUTER_ID = "courses_teacher";

export default async function coursesTeacherLoader(): Promise<coursesTeacherLoaderObject> {
    const courses: properSubject[] = await coursesLoader(teacherStudentRole.TEACHER);
    return {courses};
}