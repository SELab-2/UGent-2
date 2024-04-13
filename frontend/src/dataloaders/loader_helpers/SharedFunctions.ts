import {Project, properSubject, Subject} from "../../utils/ApiInterfaces.ts";
import apiFetch from "../../utils/ApiFetch.ts";
import {mapProjectList, mapSubjectList} from "../../utils/ApiTypesMapper.ts";
import {Backend_Project, Backend_Subject} from "../../utils/BackendInterfaces.ts";

export enum teacherStudentRole {
    STUDENT = "student",
    TEACHER = "teacher"
}

export interface CourseLoaderObject {
    course?: properSubject
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

    return courses.map((subject) => {
        const subjectProjects = projects.filter(project => project.subject_id === subject.subject_id);
        if (subjectProjects.length === 0) {
            return {
                active_projects: 0,
                first_deadline: null,
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
        return {
            active_projects: subjectProjects.length,
            first_deadline: firstDeadline,
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
    let projects: Project[] = []

    if (apiProjects.ok) {
        projects = mapProjectList(apiProjects.content);
        if (filter_on_current) {
            projects = projects.filter(project => project.project_visible && !project.project_archived)
        }
    }else{
        // TODO error handling
    }

    const apiSubjects = (await apiFetch<Backend_Subject[]>(`/${role}/subjects`));
    let subjects: Subject[] = []

    if (apiSubjects.ok){
        subjects = mapSubjectList(apiSubjects.content);
    }else{
        // TODO error handling
    }

    return {projects, subjects}
}
