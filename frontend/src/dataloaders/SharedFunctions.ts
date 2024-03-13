import {Project, Subject} from "../utils/ApiInterfaces.ts";
import apiFetch from "../utils/ApiFetch.ts";

export enum projectLoaderRole {
    STUDENT = "student",
    TEACHER = "teacher"
}

export async function projectLoader(role: projectLoaderRole): Promise<Project[]> {
    const projects: Project[] = await (await apiFetch(`/api/${role}/projects`)).json() as Project[];
    const subjects: Subject[] = await (await apiFetch(`/api/${role}/subjects`)).json() as Subject[];
    for (let i = 0; i < projects.length; i++) {
        const subject: Subject | undefined = subjects.find(subject => subject.id === projects[i].subject_id);
        if (subject !== undefined) {
            projects[i].subject_name = subject.name;
        }
    }
    // TODO: add submission data
    return projects;
}
