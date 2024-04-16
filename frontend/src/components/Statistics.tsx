import {JSX, useState} from "react";
import {PieChart} from "react-minimal-pie-chart";
import {IoIosStats} from "react-icons/io";
import { useTranslation } from 'react-i18next';

export default function Statistics(props: { statistics: number[] }): JSX.Element {

    /*
    Pending = 1,
    Approved = 2,
    Rejected = 3
     */

    const { t } = useTranslation();

    const data = [
        {title: t('statistics.success'), value: props.statistics[1], color: '#50C878'},
        {title: t('statistics.failed'), value: props.statistics[2], color: '#C13C37'},
        {title: t('statistics.nothing_yet'), value: props.statistics[0], color: '#D3D3D3'}
    ]

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
                        <p className="modal-card-title">Indieningen:</p>
                        <button className="delete" aria-label="close" onClick={closeModal}></button>
                    </header>
                    <section className="modal-card-body">
                        {props.statistics[1] + props.statistics[2] + props.statistics[0] !== 0 ?
                            <PieChart
                                label={({dataEntry}) => `${dataEntry.title}: ${Math.round(dataEntry.percentage)} %`}
                                labelStyle={() => ({
                                    fontSize: '5px',
                                })}
                                segmentsShift={0.2}
                                radius={45}
                                data={data}
                            />
                            : <p>Er zijn nog geen inzendingen</p>}
                    </section>
                    <footer className="modal-card-foot"/>
                </div>
            </div>
        </>
    )
}