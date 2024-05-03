import {JSX} from "react";
import {CompleteProjectStudent, SUBMISSION_STATE} from "../../utils/ApiInterfaces.ts";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

export default function ProjectCardStudent(props:{project: CompleteProjectStudent}): JSX.Element {

    // TODO: {{
    //      hasSubmission: check if there is a submission found in the database, if not it must return '-' on the screen
    //      isSuccess: when there is a submission, it must return either 'success' or 'failed'
    //      => if hasSubmission is false, isSuccess won't be checked (so ignoring all value changes)
    //      => when this isn't prefetched, useState will be needed for hasSubmission to rerender status correctly
    //  }}
    const hasSubmission: boolean = props.project.submission_state !== SUBMISSION_STATE.Pending;
    const isSuccess: boolean = props.project.submission_state === SUBMISSION_STATE.Approved;

    const { t } = useTranslation();

    return (
        <div className="my-5">
            <Link to={`/student/project/${props.project.project_id}`} >
                <div className={"card project-card px-5 py-5 is-flex is-flex-direction-column is-justify-content-space-between"}>
                    <p className={"title is-5"}>{props.project.project_name}</p>
                    <div className={"card-text is-flex is-flex-direction-row"}>
                        <p className={"pr-2"}>{t('home_student.card.tag.course')}</p>
                        <p>{props.project.course_name}</p>
                    </div>
                    <div className={"is-flex is-flex-direction-row is-align-items-center py-5"}>
                        <p className={"pr-2"}>{t('home_student.card.tag.status')}</p>
                        {!hasSubmission && <p className={"px-2 py-1"}>—</p>}
                        {hasSubmission && isSuccess &&
                            <div className={"card"}><p className={"p-positive px-2 py-1"}>{t('home_student.card.status.success')}</p></div>}
                        {hasSubmission && !isSuccess &&
                            <div className={"card"}><p className={"p-negative px-2 py-1"}>{t('home_student.card.status.failed')}</p></div>}
                    </div>
                </div>
            </Link>
        </div>
    )
}



