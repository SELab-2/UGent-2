import apiFetch from "../ApiFetch.ts";

export function join_subject(subjectId: number): void{
    void apiFetch(`/student/subjects/${subjectId}/join`, {
        method: 'POST'
    });
}

export function leave_subject(subjectId: number): void{
    void apiFetch(`/student/subjects/${subjectId}/leave`, {
        method: 'POST'
    });
}