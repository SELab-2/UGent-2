import apiFetch from "../ApiFetch.ts";

export function join_course(courseId: number): void{
    void apiFetch(`/student/courses/${courseId}/join`, {
        method: 'POST'
    });
}

export function leave_course(courseId: number): void{
    void apiFetch(`/student/courses/${courseId}/leave`, {
        method: 'POST'
    });
}