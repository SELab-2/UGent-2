import apiFetch from "../ApiFetch.ts";

export function join_subject(subjectId: number){
    void apiFetch(`/student/subjects/${subjectId}/join`, {
        method: 'POST'
    })
}