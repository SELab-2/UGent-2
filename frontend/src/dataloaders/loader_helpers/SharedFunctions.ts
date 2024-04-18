import {Project, properSubject, SmallProjectInfo, Subject, TeacherInfo} from "../../utils/ApiInterfaces.ts";
import apiFetch from "../../utils/ApiFetch.ts";
import {mapProjectList, mapSubjectList, mapUser} from "../../utils/ApiTypesMapper.ts";
import {Backend_Project, Backend_Subject, Backend_user} from "../../utils/BackendInterfaces.ts";

export enum teacherStudentRole {
    STUDENT = "student",
    TEACHER = "teacher"
}

export interface CourseLoaderObject {
    course?: properSubject
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

export async function coursesLoader(role: teacherStudentRole, course_id?: number): Promise<properSubject[]> {
    const temp = await getAllProjectsAndSubjects(role);
    let courses = temp.subjects;
    const projects = temp.projects;
    if (!Array.isArray(projects) || !Array.isArray(courses)) {
        throw Error("Problem loading projects or courses.");
    }

    if (course_id) {
        courses = courses.filter(course => course.subject_id === course_id);
    }

    const teachers = (await Promise.all(courses.map(async course => {
        const teacher_ids = await apiFetch(`/subjects/${course.subject_id}/teachers`) as TeacherIdInfo[];

        const teachers_promises = teacher_ids.map(async teacher_id => {
            const user = await apiFetch(`/users/${teacher_id.id}`) as Backend_user
            return mapUser(user);
        });

        const teachers = await Promise.all(teachers_promises);

        return teachers.map(teacher => {
            return {
                name: teacher.user_name,
                email: teacher.user_email,
                course_id: course.subject_id
            } as TeacherInfo
        })
    }))).flat();


    return courses.map( (subject) => {
        const subjectProjects = projects.filter(project => project.subject_id === subject.subject_id);

        if (subjectProjects.length === 0) {
            return {
                active_projects: 0,
                first_deadline: null,
                project_archived: false,
                project_visible: false,
                all_projects: [],
                teachers: [],
                subject_id: subject.subject_id,
                subject_name: subject.subject_name
            };
        }

        const shortestDeadlineProject = subjectProjects.reduce((minProject, project) => {
            if (project.project_deadline < minProject.project_deadline) {
                return project;
            } else {
                return minProject;
            }
        });
        const firstDeadline = shortestDeadlineProject.project_deadline;

        const all_projects_info = subjectProjects.map(project => {
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
            teachers: teachers.filter(teacher => teacher.course_id === subject.subject_id),
            active_projects: active_projects,
            first_deadline: firstDeadline,
            all_projects: all_projects_info,
            subject_id: subject.subject_id,
            subject_name: subject.subject_name
        }
    });
}

export interface projectsAndSubjects {
    projects: Project[],
    subjects: Subject[]
}

export async function getAllProjectsAndSubjects(role: teacherStudentRole, filter_on_current: boolean = false): Promise<projectsAndSubjects> {
    const apiProjects = (await apiFetch<Backend_Project[]>(`/${role}/projects`));
    const apiSubjects = (await apiFetch<Backend_Subject[]>(`/${role}/subjects`));
    let projects: Project[] = []
    let subjects: Subject[] = []

    if (!apiProjects.ok || !apiSubjects.ok) {
        // TODO error handling
        // throw ...
    }
    projects = mapProjectList(apiProjects.content);
    subjects = mapSubjectList(apiSubjects.content);

    if (filter_on_current) {
        projects = projects.filter(project => project.project_visible && !project.project_archived)
    }

    return {projects, subjects}
}
