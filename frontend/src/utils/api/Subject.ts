import {ProjectInput} from "../InputInterfaces.ts";
import ApiFetch from "../ApiFetch.ts";
import {Backend_Project} from "../BackendInterfaces.ts";
import {Project} from "../ApiInterfaces.ts";
import {mapProject} from "../ApiTypesMapper.ts";

export async function subject_create_project(subjectId: number, projectInput: ProjectInput): Promise<Project> {
    const projectData: Backend_Project = (await ApiFetch(`/subjects/${subjectId}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectInput)
    }) as Backend_Project);

    return mapProject(projectData);
}