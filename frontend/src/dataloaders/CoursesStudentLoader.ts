import {properCourse} from "../utils/ApiInterfaces.ts";
import {coursesLoader, teacherStudentRole} from "./loader_helpers/SharedFunctions.ts";

export const COURSES_STUDENT_ROUTER_ID = "courses_student";

export interface coursesStudentLoaderObject {
    courses: properCourse[]
}

export default async function coursesStudentLoader(): Promise<coursesStudentLoaderObject> {
    const courses: properCourse[] = await coursesLoader(teacherStudentRole.STUDENT);
    return {courses};
}