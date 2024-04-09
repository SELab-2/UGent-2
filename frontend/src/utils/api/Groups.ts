import ApiFetch from "./ApiFetch.ts";

export function joinGroup(groupId: number) {
    void ApiFetch(`/groups/${groupId}/join`,
        {method: 'POST', headers: {'Content-Type': 'application/json'}});
}

export function leaveGroup(groupId: number) {
    void ApiFetch(`/groups/${groupId}/leave`,
        {method: 'POST', headers: {'Content-Type': 'application/json'}});
}

export async function listGroupMembers(groupId: number) {
    let members = await ApiFetch(`/groups/${groupId}/members`,
        {method: 'GET', headers: {'Content-Type': 'application/json'}});
    return members;
}

export function projectGroup(projectId: number) {
    let group = void ApiFetch(`/projects/${projectId}/group`,
        {method: 'GET', headers: {'Content-Type': 'application/json'}});
    return group;
}