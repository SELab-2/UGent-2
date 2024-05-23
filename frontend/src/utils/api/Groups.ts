import ApiFetch from "../ApiFetch.ts";

export async function joinGroup(groupId: number): Promise<void> {
    await ApiFetch(`/groups/${groupId}/join`,
        {method: 'POST', headers: {'Content-Type': 'application/json'}});
}

export async function leaveGroup(groupId: number): Promise<void> {
    await ApiFetch(`/groups/${groupId}/leave`,
        {method: 'POST', headers: {'Content-Type': 'application/json'}});
}