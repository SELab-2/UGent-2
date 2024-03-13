import apiFetch from "../utils/ApiFetch.ts";
import {Project, Subject} from "../utils/ApiInterfaces.ts";

export interface studentLoaderObject {
    projects: Project[]
}
export default async function studentLoader(): Promise<studentLoaderObject> {
    const projects: Project[] = await (await apiFetch("/api/student/projects")).json() as Project[];
    const subjects: Subject[] = await (await apiFetch("/api/student/subjects")).json() as Subject[];
    for (let i = 0; i < projects.length; i++) {
        const subject: Subject | undefined = subjects.find(subject => subject.id === projects[i].subject_id);
        if (subject !== undefined) {
            projects[i].subject_name = subject.name;
        }
    }
    // TODO: add submission data
    return {"projects": projects};
}