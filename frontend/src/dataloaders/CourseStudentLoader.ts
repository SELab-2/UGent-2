import {properSubject} from "../utils/ApiInterfaces.ts";
import {coursesLoader, teacherStudentRole} from "./SharedFunctions.ts";

export const COURSE_STUDENT = "course_student";

export interface courseStudentLoaderObject {
    course?: properSubject
}

export default async function courseStudentLoader(course_id?: string): Promise<courseStudentLoaderObject> {
    if (!course_id || isNaN(parseInt(course_id))) {
        return {course: undefined}
    }
    const id = parseInt(course_id);
    return {course: (await coursesLoader(teacherStudentRole.STUDENT, id)).find(() => true)};
}