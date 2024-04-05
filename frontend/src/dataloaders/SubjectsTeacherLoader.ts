import {properSubject} from "../utils/ApiInterfaces.ts";

export interface subjectsTeacherLoaderObject {
    subjects: properSubject[]
}

// export const SUBJECT_TEACHER_ROUTER_ID = "subjectTeacher";

export default async function subjectsTeacherLoader(): Promise<subjectsTeacherLoaderObject> {
    // const temp: projectsAndSubjects = await getAllProjectsAndSubjects(teacherStudentRole.TEACHER);
    // const subjects: Subject[] = temp.subjects;
    // const projects: Project[] = temp.projects;

    // const p_subjects: properSubject[] = subjects.map(subject => {
    //     const active_projects = projects.filter(project =>
    //         project.archived && project.subject_id === subject.id
    //     );
    //     return {
    //         id: subject.id,
    //         name: subject.name,
    //         active_projects: active_projects.length,
    //         first_deadline: null // TODO: add deadlines when needed api endpoints are added.
    //     };
    // });
    return {"subjects": []}
}