import ApiFetch from "../ApiFetch.ts";

export function joinGroup(groupId: number): void {
    void ApiFetch(`/groups/${groupId}/join`,
        {method: 'POST', headers: {'Content-Type': 'application/json'}});
}

export function leaveGroup(groupId: number): void {
    void ApiFetch(`/groups/${groupId}/leave`,
        {method: 'POST', headers: {'Content-Type': 'application/json'}});
}