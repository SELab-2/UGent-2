import apiFetch from "../ApiFetch.ts";

export function join_course(courseId: number): void {
    void apiFetch(`/student/courses/${courseId}/join`, {
        method: 'POST'
    })
    .then(() => {
        window.location.replace(`/student/course/${courseId}`);
    })
    .catch(() => console.log("Something went wrong."));
}

export async function leave_course(courseId: number): Promise<boolean> {
    const response = await apiFetch(`/student/courses/${courseId}/leave`, {
        method: 'POST'
    });
    return response.ok
}