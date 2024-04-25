import {Course, Project, teacherStudentRole} from "../utils/ApiInterfaces.ts";
import {getAllProjectsAndCourses} from "./loader_helpers/SharedFunctions.ts";

export interface teacherLoaderObject {
    projects: Project[]
    courses: Course[]
}

export const TEACHER_ROUTER_ID = "teacher";

export default async function teacherLoader(): Promise<teacherLoaderObject> {
    const temp = await getAllProjectsAndCourses(teacherStudentRole.TEACHER, false);
    return {projects: temp.projects, courses: temp.courses};
}