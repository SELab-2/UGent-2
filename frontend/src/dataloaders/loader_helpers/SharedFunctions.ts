import {
    Course,
    CourseLoaderObject,
    Project,
    properCourse,
    SmallProjectInfo,
    SmallUserInfo,
    teacherStudentRole
} from "../../utils/ApiInterfaces.ts";
import apiFetch from "../../utils/ApiFetch.ts";
import {mapCourseList, mapProjectList, mapUser} from "../../utils/ApiTypesMapper.ts";
import {Backend_Course, Backend_Project, Backend_user} from "../../utils/BackendInterfaces.ts";

export interface UserIdInfo {
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

    const teachers = (await getUsersOfCourse(teacherStudentRole.TEACHER, courses))
    const students = (await getUsersOfCourse(teacherStudentRole.STUDENT, courses))

    return courses.map((course) => {
        const courseProjects = projects.filter(project => project.course_id === course.course_id);
        if (courseProjects.length === 0) {
            return {
                active_projects: 0,
                first_deadline: null,
                project_archived: false,
                project_visible: false,
                all_projects: [],
                teachers: teachers.filter(teacher => teacher?.course_id === course.course_id) as SmallUserInfo[],
                students: students.filter(student => student?.course_id === course.course_id) as SmallUserInfo[],
                course_archived: false,
                course_id: course.course_id,
                course_name: course.course_name
            };
        }

        const firstDeadline = getFirstUpcomingDeadline(courseProjects);

        const all_projects_info = courseProjects.map(getSmallProjectInfo);

        const active_projects = all_projects_info.filter(project => !project.project_archived && project.project_visible).length

        return {
            teachers: teachers.filter(teacher => teacher && teacher.course_id === course.course_id) as SmallUserInfo[],
            students: students.filter(student => student && student.course_id === course.course_id) as SmallUserInfo[],
            active_projects: active_projects,
            first_deadline: firstDeadline,
            all_projects: all_projects_info,
            course_id: course.course_id,
            course_name: course.course_name,
            course_archived: course.course_archived
        }
    });
}

function getSmallProjectInfo(project: Project): SmallProjectInfo {
    return {
        project_id: project.project_id,
        project_visible: project.project_visible,
        project_deadline: project.project_deadline,
        project_name: project.project_name,
        project_archived: project.project_archived
    }
}


function getFirstUpcomingDeadline(courseProjects: Project[]): string | Date {
    const first_deadline = courseProjects.filter(course => course.project_visible && !course.project_archived).reduce((minProject, project) => {
        if (project.project_deadline < minProject.project_deadline) {
            return project;
        } else {
            return minProject;
        }
    });
    return first_deadline.project_deadline;
}

async function getUsersOfCourse(role: teacherStudentRole, courses: Course[]): Promise<(SmallUserInfo | undefined)[]> {
    return (await Promise.all(courses.map(async course => {
        const user_ids_data = await apiFetch<UserIdInfo[]>(`/courses/${course.course_id}/${role + "s"}`);
        let user_ids: UserIdInfo[] = []
        if (user_ids_data.ok) {
            user_ids = user_ids_data.content;
        }

        const user_promises = user_ids.map(async user_id => {
            const userData = await apiFetch<Backend_user>(`/users/${user_id.id}`);
            if (userData.ok) {
                return mapUser(userData.content);
            }
            return undefined;
        });

        const users = await Promise.all(user_promises);

        return users.map(user => {
            if (user) {
                return {
                    name: user.user_name,
                    email: user.user_email,
                    user_id: user.user_id,
                    course_id: course.course_id
                } as SmallUserInfo
            }
        })
    }))).flat()
}

export interface projectsAndCourses {
    projects: Project[],
    courses: Course[]
}

export async function getAllProjectsAndCourses(role: teacherStudentRole, filter_on_current: boolean = false): Promise<projectsAndCourses> {
    const apiProjects = (await apiFetch<Backend_Project[]>(`/${role}/projects`));
    const apiCourses = (await apiFetch<Backend_Course[]>(`/${role}/courses`));
    let projects: Project[] = []

    if (apiProjects.ok) {
        projects = mapProjectList(apiProjects.content);
    }

    if (filter_on_current) {
        projects = projects.filter(project => project.project_visible && !project.project_archived)
    }
    let courses: Course[] = []
    if (apiCourses.ok) {
        courses = mapCourseList(apiCourses.content);
    }

    return {projects, courses}
}
