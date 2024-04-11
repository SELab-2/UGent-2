import {
    courseLoader,
    CourseLoaderObject,
    teacherStudentRole
} from "./loader_helpers/SharedFunctions.ts";

export const COURSE_STUDENT = "course_student";

export default async function courseStudentLoader(course_id?: string): Promise<CourseLoaderObject> {
    return courseLoader(teacherStudentRole.STUDENT, course_id);
}