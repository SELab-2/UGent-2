import {JSX} from "react";
import {FaArrowRightLong} from "react-icons/fa6";
import {CompleteProjectStudent} from "../../utils/ApiInterfaces.ts";

function DeadlineElement(props: {project: CompleteProjectStudent}): JSX.Element {
    const deadline_date = new Date(props.project.project_deadline)
    const deadline = `${deadline_date.getHours()}:${deadline_date.getMinutes()} - ${deadline_date.getDate()}/${deadline_date.getMonth()}/${deadline_date.getFullYear()}`
    return (
        <div className={"deadline-card is-flex is-flex-direction-column is-align-items-center py-2"}>
            <p>{deadline}</p>
            <div className={"is-flex is-flex-direction-row is-align-items-center"}>
                <FaArrowRightLong/>
                <p className={"pl-2"}>{props.project.project_name}</p>
            </div>
        </div>
    )
}

function DeadlineTable(props: {projects: CompleteProjectStudent[]}): JSX.Element {
    return (
        <div className={"deadline"}>
            <div className={"deadline-head is-flex is-justify-content-center py-2"}>
                <p>komende deadlines</p>
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