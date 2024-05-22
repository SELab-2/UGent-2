import {Backend_Course} from "../BackendInterfaces.ts";
import apiFetch from "../ApiFetch.ts";
import {Course} from "../ApiInterfaces.ts";
import {mapCourse} from "../ApiTypesMapper.ts";

export async function createCourse(name: string): Promise<Course> {
    const courseData = (await apiFetch<Backend_Course>('/teacher/courses',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({name: name, archived: false})
        }));

    if (courseData.ok){
        return mapCourse(courseData.content);
    }else{
        throw courseData.status_code
    }
}

export async function leave_course(courseId: number): Promise<boolean> {
    const response = await apiFetch(`/teacher/courses/${courseId}/leave`, {
        method: 'POST'
    });
    return response.ok
}
