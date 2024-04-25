import {Course, Project, properCourse, SmallProjectInfo, StudentInfo, TeacherInfo} from "../../utils/ApiInterfaces.ts";
import apiFetch from "../../utils/ApiFetch.ts";
import {mapCourseList, mapProjectList, mapUser} from "../../utils/ApiTypesMapper.ts";
import {Backend_Course, Backend_Project, Backend_user} from "../../utils/BackendInterfaces.ts";

export enum teacherStudentRole {
    STUDENT = "student",
    TEACHER = "teacher"
}

export interface CourseLoaderObject {
    course?: properCourse
}

export interface TeacherIdInfo {
    id: number
}


export async function parse_id_and_get_item<T>(id: string | undefined, loader: (id: number) => Promise<T[]>): Promise<T | undefined> {
    if (!id || isNaN(parseInt(id))) {
        return undefined;
    }
    const parsed_id = parseInt(id);
    return (await loader(parsed_id)).find(() => true);
}

export async function courseLoader(role: teacherStudentRole, course_id: string | undefined): Promise<CourseLoaderObject> {
    return {
        course: await parse_id_and_get_item(
            course_id,
            (id) => coursesLoader(role, id)
        )
    };
}

export async function coursesLoader(role: teacherStudentRole, course_id?: number): Promise<properCourse[]> {
    const temp = await getAllProjectsAndCourses(role);
    let courses = temp.courses;
    const projects = temp.projects;
    if (!Array.isArray(projects) || !Array.isArray(courses)) {
        throw Error("Problem loading projects or courses.");
    }

    if (course_id) {
        courses = courses.filter(course => course.course_id === course_id);
    }

    const teachers = (await Promise.all(courses.map(async course => {
        const teacher_ids_data = await apiFetch<TeacherIdInfo[]>(`/courses/${course.course_id}/teachers`);
        if (!teacher_ids_data.ok){
            // TODO error handling
        }
        const teacher_ids = teacher_ids_data.content
        const teachers_promises = teacher_ids.map(async teacher_id => {
            const userData = await apiFetch<Backend_user>(`/users/${teacher_id.id}`);
            if (!userData.ok){
                // TODO error handling
            }
            return mapUser(userData.content);
        });

        const teachers = await Promise.all(teachers_promises);

        return teachers.map(teacher => {
            return {
                name: teacher.user_name,
                email: teacher.user_email,
                course_id: course.course_id
            } as TeacherInfo
        })
    }))).flat();

    const students = (await Promise.all(courses.map(async course => {
        const student_ids_data = await apiFetch<TeacherIdInfo[]>(`/courses/${course.course_id}/students`);
        if (!student_ids_data.ok){
            // TODO error handling
        }
        const student_ids = student_ids_data.content
        const student_promises = student_ids.map(async teacher_id => {
            const userData = await apiFetch<Backend_user>(`/users/${teacher_id.id}`);
            if (!userData.ok){
                // TODO error handling
            }
            return mapUser(userData.content);
        });

        const students = await Promise.all(student_promises);

        return students.map(teacher => {
            return {
                name: teacher.user_name,
                email: teacher.user_email,
                course_id: course.course_id
            } as StudentInfo
        })
    }))).flat();


    return courses.map( (course) => {
        const courseProjects = projects.filter(project => project.course_id === course.course_id);

        if (courseProjects.length === 0) {
            return {
                active_projects: 0,
                first_deadline: null,
                project_archived: false,
                project_visible: false,
                all_projects: [],
                teachers: [],
                students: [],
                course_archived: false,
                course_id: course.course_id,
                course_name: course.course_name
            };
        }

        const shortestDeadlineProject = courseProjects.filter(course => course.project_visible && !course.project_archived).reduce((minProject, project) => {
            if (project.project_deadline < minProject.project_deadline) {
                return project;
            } else {
                return minProject;
            }
        });
        const firstDeadline = shortestDeadlineProject.project_deadline;

        const all_projects_info = courseProjects.map(project => {
            return {
                project_name: project.project_name,
                project_archived: project.project_archived,
                project_visible: project.project_visible,
                project_deadline: project.project_deadline,
                project_id: project.project_id,
            } as SmallProjectInfo;
        });

        const active_projects = all_projects_info.filter(project => !project.project_archived && project.project_visible).length


        return {
            teachers: teachers.filter(teacher => teacher.course_id === course.course_id),
            students: students.filter(student => student.course_id === course.course_id),
            active_projects: active_projects,
            first_deadline: firstDeadline,
            all_projects: all_projects_info,
            course_id: course.course_id,
            course_name: course.course_name,
            course_archived: course.course_archived
        }
    });
}

export interface projectsAndCourses {
    projects: Project[],
    courses: Course[]
}

export async function getAllProjectsAndCourses(role: teacherStudentRole, filter_on_current: boolean = false): Promise<projectsAndCourses> {
    const apiProjects = (await apiFetch<Backend_Project[]>(`/${role}/projects`));
    const apiCourses = (await apiFetch<Backend_Course[]>(`/${role}/courses`));

    if (!apiProjects.ok || !apiCourses.ok) {
        // TODO error handling
        // throw ...
    }
    let projects = mapProjectList(apiProjects.content);
    if (filter_on_current) {
        projects = projects.filter(project => project.project_visible && !project.project_archived)
    }

    const courses = mapCourseList(apiCourses.content);
    return {projects, courses}
}
