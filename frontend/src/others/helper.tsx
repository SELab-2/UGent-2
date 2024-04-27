import ProjectCardStudent from "../pages/student/ProjectCardStudent.tsx";
import ProjectCardTeacher from "../pages/teacher/ProjectCardTeacher.tsx";
import {CompleteProjectStudent, Course, Project} from "../utils/ApiInterfaces.ts";
import {Link} from "react-router-dom";

export default function RenderProjectCards(props: { projects: Project[] | CompleteProjectStudent[], courses?: Course[] }): JSX.Element {
    return (
        <>

            {props.projects.map((project) => {
                if ('course_id' in project && props.courses) {
                    return <Link to={`/teacher/project/${project.project_id}`} key={project.project_id}>
                        <ProjectCardTeacher project={project} course={props.courses.filter(e => e.course_id == project.course_id)[0]}/>
                    </Link>;
                } else if ("submission_state" in project) {
                    return <Link to={`/student/project/${project.project_id}`} key={project.project_id}>
                        <ProjectCardStudent project={project} />
                    </Link>;
                }
            })}
        </>
    );
}
