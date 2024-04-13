import apiFetch from "../ApiFetch.ts";
import {ProjectInput} from "../InputInterfaces.ts";
import {Backend_group, Backend_Project} from "../BackendInterfaces.ts";
import {mapGroup} from "../ApiTypesMapper.ts";

export async function project_create_group(project_id: number){
    const groupData = await apiFetch(`/projects/${project_id}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }) as Backend_group
    return mapGroup(groupData)
}

export async function update_project(project_id: number, projectInput: ProjectInput){
    const projectData = await apiFetch(`/projects/${project_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectInput)
    }) as Backend_Project
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

