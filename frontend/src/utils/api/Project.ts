import apiFetch from "../ApiFetch.ts";
import {ProjectInput} from "../InputInterfaces.ts";
import {Backend_group, Backend_Project} from "../BackendInterfaces.ts";
import {mapGroup, mapProject} from "../ApiTypesMapper.ts";
import {Group, Project} from "../ApiInterfaces.ts";

export async function project_create_group(project_id: number): Promise<Group>{
    const groupData = await apiFetch(`/projects/${project_id}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }) as Backend_group;
    return mapGroup(groupData);
}

export async function update_project(project_id: number, projectInput: ProjectInput): Promise<Project>{
    const projectData = await apiFetch(`/projects/${project_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectInput)
    }) as Backend_Project;
    return mapProject(projectData);
}

