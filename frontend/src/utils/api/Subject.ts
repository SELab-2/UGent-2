import {ProjectInput} from "../InputInterfaces.ts";
import ApiFetch from "../ApiFetch.ts";
import {Backend_Project} from "../BackendInterfaces.ts";

export async function subject_create_project(subjectId: number, projectInput: ProjectInput) {
    const projectData: Backend_Project = (await ApiFetch(`/subjects/${subjectId}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectInput)
    }) as Backend_Project)

    return {
        project_id: projectData.id,
        project_name: projectData.name,
        project_deadline: projectData.deadline,
        project_archived: projectData.archived,
        project_description: projectData.description,
        project_requirements: projectData.requirements,
        project_visible: projectData.visible,
        project_max_students: projectData.max_students,
        subject_id: projectData.subject_id
    }
}