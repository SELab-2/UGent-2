import {CompleteProjectTeacher, Group, SUBMISSION_STATE, teacherStudentRole} from "../utils/ApiInterfaces.ts";
import {getAllProjectsAndCourses} from "./loader_helpers/SharedFunctions.ts";
import apiFetch from "../utils/ApiFetch.ts";
import {Backend_group, Backend_submission} from "../utils/BackendInterfaces.ts";
import {mapGroupList, mapSubmission} from "../utils/ApiTypesMapper.ts";

export interface projectsTeacherLoaderObject {
    projects: CompleteProjectTeacher[]
}

export const PROJECTS_TEACHER_ROUTER_ID = "projects_teacher";

export default async function projectsTeacherLoader(): Promise<projectsTeacherLoaderObject> {
    const projects: CompleteProjectTeacher[] = await LoadProjectsForTeacher();
    return {projects};
}

export async function LoadProjectsForTeacher(filter_on_current: boolean = false, project_id?: number): Promise<CompleteProjectTeacher[]> {
    if (project_id) {
        filter_on_current = false;
    }
    const temp = await getAllProjectsAndCourses(teacherStudentRole.TEACHER, filter_on_current);
    const courses = temp.courses;
    let projects = temp.projects;
    if (!Array.isArray(projects) || !Array.isArray(courses)) {
        throw Error("Problem loading projects or courses.");
    }

    if (project_id) {
        projects = projects.filter(project => project.project_id === project_id);
    }

    const groupPromises: Promise<Group[][]> = Promise.all(projects.map(async project => {
        const groups = await apiFetch<Backend_group[]>(`/projects/${project.project_id}/groups`);
        if (!groups.ok) {
            // TODO: error handling
        }
        return mapGroupList(groups.content);
    }));

    const statistics: { [key: number]: number } = {
        [SUBMISSION_STATE.Pending]: 0,
        [SUBMISSION_STATE.Approved]: 0,
        [SUBMISSION_STATE.Rejected]: 0
    };

    const groups: Group[][] = (await groupPromises)
    const amount_of_submissions: number[] = []
    for (const groupArray of groups) {
        let amount = 0
        for (const group of groupArray) {
            try {
                const submissionData = await apiFetch<Backend_submission>(`/groups/${group.group_id}/submission`);
                if (!submissionData.ok){
                    continue
                }
                const submissionBackend = submissionData.content
                if (submissionBackend) {
                    const submission = mapSubmission(submissionData.content)
                    if (submission.submission_id !== undefined){
                        statistics[submission.submission_state] += 1;
                        amount++;
                    }
                }
            } catch (e) {
                //console.log(e);
            }
        }
        amount_of_submissions.push(amount);
    }
    return projects.map((project, index) => {
        const course = courses.find(course => course.course_id === project.course_id);
        if (!course) {
            throw Error("Course not found for project.");
        }
        return {
            ...project,
            ...course,
            courses: courses,
            submission_amount: amount_of_submissions[index],
            submission_statistics: statistics
        }
    })
}