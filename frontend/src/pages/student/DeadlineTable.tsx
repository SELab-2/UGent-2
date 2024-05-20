import {JSX} from "react";
import {FaArrowRightLong} from "react-icons/fa6";
import {CompleteProjectStudent} from "../../utils/ApiInterfaces.ts";
import {useTranslation} from 'react-i18next';
import {deadline_to_string} from "../../utils/helper.ts";

function DeadlineElement(props: { project: CompleteProjectStudent }): JSX.Element {
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

function DeadlineTable(props: { projects: CompleteProjectStudent[] }): JSX.Element {

    const today = new Date();

    const filteredAndSortedProjects = props.projects
        .filter(project => new Date(project.project_deadline) >= today)
        .sort((a, b) => new Date(a.project_deadline).getTime() - new Date(b.project_deadline).getTime());

    const {t} = useTranslation();

    return (
        <div className={"deadline"}>
            <div className={"deadline-head is-flex is-justify-content-center py-2"}>
                <p>{t('home_student.deadlines')}</p>
            </div>
            {props.projects.length == 0 ?
                <div className={"deadline-elements is-flex is-justify-content-center is-align-items-center"}>
                    <p>{t('empty-home.empty-deadline')}</p>
                </div>
                :
                <div className={"deadline-elements"}>
                    {filteredAndSortedProjects.map((project) => {
                        return <DeadlineElement key={project.project_id} project={project}/>
                    })}
                </div>
            }
        </div>
    )
}

export default DeadlineTable;