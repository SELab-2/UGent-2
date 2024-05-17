import ApiFetch from "../utils/ApiFetch.ts";
import {Backend_Course} from "../utils/BackendInterfaces.ts";

export const JOIN_COURSE = "JOIN_COURSE"

export interface JoinCourseObject {
    course_id: number
    course_name: string
    error?: string
}

export default async function joinCourse(id?: string): Promise<JoinCourseObject> {
    if (!id || isNaN(parseInt(id))) {
        return {course_id: 0, course_name: "", error: "Invalid course id"};
    }
    const course_id= parseInt(id);
    const course = await ApiFetch<Backend_Course>(`/courses/${course_id}`);
    if (!course.ok) {
        return {course_id, course_name: "", error: course.status_code.toString()};
    }
    return {course_id, course_name: course.content.name};
}