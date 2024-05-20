import {ProjectInput, CourseInput} from "../InputInterfaces.ts";
import ApiFetch from "../ApiFetch.ts";
import {Backend_Project} from "../BackendInterfaces.ts";
import {Project} from "../ApiInterfaces.ts";
import {mapProject} from "../ApiTypesMapper.ts";

export async function course_create_project(courseId: number, projectInput: ProjectInput): Promise<Project> {
    const projectData = (await ApiFetch<Backend_Project>(`/courses/${courseId}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectInput)
    }));
    if (projectData.ok) {
        return mapProject(projectData.content);
    }else{
        throw projectData.status_code
    }
}

export async function update_course(courseId: number, courseInput: CourseInput){
    const courseData = (await ApiFetch<Backend_Project>(`/courses/${courseId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseInput)
    }));
    return courseData.ok;
}