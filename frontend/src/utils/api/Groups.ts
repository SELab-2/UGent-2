import ApiFetch from "../ApiFetch.ts";

export function joinGroup(groupId: number): void {
    void ApiFetch(`/groups/${groupId}/add`,
        {method: 'POST', headers: {'Content-Type': 'application/json'}});
}

export function leaveGroup(groupId: number): void {
    void ApiFetch(`/groups/${groupId}/remove`,
        {method: 'POST', headers: {'Content-Type': 'application/json'}});
}