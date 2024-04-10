import {properSubject} from "../utils/ApiInterfaces.ts";
import {coursesLoader, teacherStudentRole} from "./SharedFunctions.ts";

export const COURSE_TEACHER = "course_teacher";

export interface courseTeacherLoaderObject {
    course?: properSubject
}

export default async function courseTeacherLoader(course_id?: string): Promise<courseTeacherLoaderObject> {
    if (!course_id || isNaN(parseInt(course_id))) {
        return {course: undefined}
    }
    const id = parseInt(course_id);
    return {course: (await coursesLoader(teacherStudentRole.TEACHER, id)).find(() => true)};
}