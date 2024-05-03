import { Link } from "react-router-dom";
import ProjectCardStudent from "../pages/student/ProjectCardStudent.tsx";
import ProjectCardTeacher from "../pages/teacher/ProjectCardTeacher.tsx";
import {CompleteProjectStudent, Course, Project} from "../utils/ApiInterfaces.ts";

export default function RenderProjectCards(props: { projects: Project[] | CompleteProjectStudent[], courses?: Course[] }): JSX.Element {
    return (
        <>

            {props.projects.map((project) => {
                if ('course_id' in project && props.courses) {
                    return <Link to={`/teacher/project/${project.project_id}`} key={project.project_id}>
                        <ProjectCardTeacher project={project} course={props.courses.filter(e => e.course_id == project.course_id)[0]}/>
                    </Link>; 
                } else if ("submission_state" in project) {
                    return <ProjectCardStudent key={project.project_id} project={project} />
                }
            })}
        </>
    );
}
