import {JSX} from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

function DeadlineElement(): JSX.Element {
    return (
        <div className={"deadline-card is-flex is-flex-direction-column is-align-items-center py-2"}>
            <p>17:00 - 23/02</p>
            <div className={"is-flex is-flex-direction-row is-align-items-center"}>
                <FaArrowRightLong/>
                <p className={"pl-2"}>Markov Decision Diagram</p>
            </div>
        </div>
    )
}

function DeadlineTable(): JSX.Element {

    const { t } = useTranslation();

    return (
        <div className={"deadline"}>
            <div className={"deadline-head is-flex is-justify-content-center py-2"}>
                <p>{t('home_student.deadlines')}</p>
            </div>
            <div className={"deadline-elements"}>
                <DeadlineElement/>
                <DeadlineElement/>
                <DeadlineElement/>
                <DeadlineElement/>
                <DeadlineElement/>
                <DeadlineElement/>
            </div>
        </div>
    )
}

export default DeadlineTable;