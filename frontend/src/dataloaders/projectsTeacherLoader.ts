import {CompleteProjectTeacher, Group, SUBMISSION_STATE} from "../utils/ApiInterfaces.ts";
import {getAllProjectsAndSubjects, teacherStudentRole} from "./loader_helpers/SharedFunctions.ts";
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
    const temp = await getAllProjectsAndSubjects(teacherStudentRole.TEACHER, filter_on_current);
    const subjects = temp.subjects;
    let projects = temp.projects;
    if (!Array.isArray(projects) || !Array.isArray(subjects)) {
        throw Error("Problem loading projects or courses.");
    }

    if (project_id) {
        projects = projects.filter(project => project.project_id === project_id);
    }

    const groupPromises: Promise<Group[][]> = Promise.all(projects.map(async project => {
        const groups = await apiFetch(`/projects/${project.project_id}/groups`) as Backend_group[];
        return mapGroupList(groups);
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
                const submissionBackend = await apiFetch(`/groups/${group.group_id}/submission`) as Backend_submission;
                const submission = mapSubmission(submissionBackend);
                if (submission) {
                    console.log(submission)
                    statistics[submission.submission_state] += 1;
                    amount++;
                }
            } catch (e) {
                //console.log(e);
            }
        }
        amount_of_submissions.push(amount);
    }
    return projects.map((project, index) => {
        const subject = subjects.find(subject => subject.subject_id === project.subject_id);
        if (!subject) {
            throw Error("Subject not found for project.");
        }
        return {
            ...project,
            ...subject,
            subjects: subjects,
            submission_amount: amount_of_submissions[index],
            submission_statistics: statistics
        }
    })
}