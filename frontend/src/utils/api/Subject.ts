import {ProjectInput, SubjectInput} from "../InputInterfaces.ts";
import ApiFetch from "../ApiFetch.ts";
import {Backend_Project} from "../BackendInterfaces.ts";
import {Project} from "../ApiInterfaces.ts";
import {mapProject} from "../ApiTypesMapper.ts";

export async function subject_create_project(subjectId: number, projectInput: ProjectInput): Promise<Project> {
    const projectData = (await ApiFetch<Backend_Project>(`/subjects/${subjectId}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectInput)
    }));
    if (projectData.ok) {
        return mapProject(projectData.content);
    }else{
        // TODO: error handling
        throw projectData.status_code
    }
}

export async function update_subject(subjectId: number, subjectInput: SubjectInput){
    const projectData = (await ApiFetch<Backend_Project>(`/subjects/${subjectId}/projects`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subjectInput)
    }));
    return projectData.ok;
}