import {useTranslation} from "react-i18next";
import {Course, Project} from "../../utils/ApiInterfaces.ts";

export default function ProjectCardTeacher(props:{project:Project, course: Course}): JSX.Element {

    const { t } = useTranslation();

    return (
        <div
            className={"card project-card px-5 py-5 my-5 is-flex is-flex-direction-column"}>
            <p className={"title is-5"}>{props.project.project_name}</p>
            <div className={"card-text is-flex is-flex-direction-row"}>
                <p className={"pr-2"}>{t('home_student.card.tag.course')}</p>
                <p>{props.course.course_name}</p>
            </div>
        </div>
    )
}