import {JSX, useState} from "react";
import {PieChart} from "react-minimal-pie-chart";
import {IoIosStats} from "react-icons/io";
import {useTranslation} from 'react-i18next';
import {SUBMISSION_STATE} from "../utils/ApiInterfaces.ts";

export default function Statistics(props: { statistics: { [key: number]: number } }): JSX.Element {

    const {t} = useTranslation();

    const data = [
        {title: t('statistics.success'), value: props.statistics[SUBMISSION_STATE.Approved], color: '#50C878'},
        {title: t('statistics.failed'), value: props.statistics[SUBMISSION_STATE.Rejected], color: '#C13C37'},
        {title: t('statistics.nothing_yet'), value: props.statistics[SUBMISSION_STATE.Pending], color: '#D3D3D3'}
    ].filter((entry) => entry.value !== 0);

    const [modalActive, setModalActive] = useState(false);

    const openModal = () => {
        setModalActive(true);
    };

    const closeModal = () => {
        setModalActive(false);
    };

    return (
        <>
            <button className="js-modal-trigger button is-rounded is-pulled-right" onClick={openModal}>
                <span className="icon is-small">
                    <IoIosStats/>
                </span>
                <span>{t('statistics.tag')}</span>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={closeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t("statistics.submissions")}</p>
                        <button className="delete" aria-label="close" onClick={closeModal}></button>
                    </header>
                    <section className="modal-card-body">
                        {props.statistics[SUBMISSION_STATE.Pending] + props.statistics[SUBMISSION_STATE.Rejected] + props.statistics[SUBMISSION_STATE.Approved] !== 0 ?
                            <PieChart
                                label={({dataEntry}) => `${dataEntry.title}: ${Math.round(dataEntry.percentage)} %`}
                                labelStyle={() => ({
                                    fontSize: '5px',
                                })}
                                segmentsShift={0.2}
                                radius={45}
                                data={data}
                            />
                            : <p>{t("statistics.no_submissions")}</p>}
                    </section>
                    <footer className="modal-card-foot"/>
                </div>
            </div>
        </>
    )
}