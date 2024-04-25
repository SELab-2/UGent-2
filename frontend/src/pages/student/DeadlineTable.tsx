import {JSX} from "react";
import {FaArrowRightLong} from "react-icons/fa6";
import {CompleteProjectStudent} from "../../utils/ApiInterfaces.ts";
import {useTranslation} from 'react-i18next';
import {deadline_to_string} from "../../utils/helper.ts";

function DeadlineElement(props: {project: CompleteProjectStudent}): JSX.Element {
    return (
        <div className={"deadline-card is-flex is-flex-direction-column is-align-items-center py-2"}>
            <p>{deadline_to_string(props.project.project_deadline)}</p>
            <div className={"is-flex is-flex-direction-row is-align-items-center"}>
                <FaArrowRightLong/>
                <p className={"pl-2"}>{props.project.project_name}</p>
            </div>
        </div>
    )
}

function DeadlineTable(props: {projects: CompleteProjectStudent[]}): JSX.Element {

    const { t } = useTranslation();

    return (
        <div className={"deadline"}>
            <div className={"deadline-head is-flex is-justify-content-center py-2"}>
                <p>{t('home_student.deadlines')}</p>
            </div>
            <div className={"deadline-elements"}>
                {props.projects.map((project) => {
                    return <DeadlineElement key={project.project_id} project={project}/>
                })}
            </div>
        </div>
    )
}

export default DeadlineTable;