import apiFetch from "../ApiFetch.ts";
import {ProjectInput} from "../InputInterfaces.ts";
import {Backend_group, Backend_Project} from "../BackendInterfaces.ts";
import {mapGroup} from "../ApiTypesMapper.ts";
import {Group} from "../ApiInterfaces.ts";

export async function project_create_group(project_id: number): Promise<Group> {
    const groupData = await apiFetch<Backend_group>(`/projects/${project_id}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (groupData.ok) {
        return mapGroup(groupData.content);
    }
    throw groupData.status_code
}

export async function update_project(project_id: number, projectInput: ProjectInput): Promise<boolean> {
    const projectData = await apiFetch<Backend_Project>(`/projects/${project_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectInput)
    });
    return projectData.ok;
}

