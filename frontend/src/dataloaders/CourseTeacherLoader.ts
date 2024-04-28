import {courseLoader} from "./loader_helpers/SharedFunctions.ts";
import {CourseLoaderObject, teacherStudentRole} from "../utils/ApiInterfaces.ts";

export const COURSE_TEACHER = "course_teacher";

export default async function courseTeacherLoader(course_id?: string): Promise<CourseLoaderObject> {
    return courseLoader(teacherStudentRole.TEACHER, course_id);
}