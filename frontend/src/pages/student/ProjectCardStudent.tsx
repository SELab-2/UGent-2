import {JSX} from "react";
import { useTranslation } from 'react-i18next';

export default function ProjectCardStudent(): JSX.Element {
    // TODO: {{
    //      hasSubmission: check if there is a submission found in the database, if not it must return '-' on the screen
    //      isSuccess: when there is a submission, it must return either 'success' or 'failed'
    //      => if hasSubmission is false, isSuccess won't be checked (so ignoring all value changes)
    //      => when this isn't prefetched, useState will be needed for hasSubmission to rerender status correctly
    //  }}
    const hasSubmission: boolean = false;
    const isSuccess: boolean = true;

    const { t } = useTranslation();

    return (
        <div
            className={"card project-card px-5 py-5 my-5 is-flex is-flex-direction-column is-justify-content-space-between"}>
            <p className={"title is-5"}>Markov Decision Diagram</p>
            <div className={"card-text is-flex is-flex-direction-row"}>
                <p className={"pr-2"}>{t('home_student.card.tag.course')}</p>
                <p>Computationele Biologie</p>
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
    )
}



