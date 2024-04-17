import {JSX, useState} from "react";
import {PieChart} from "react-minimal-pie-chart";
import {IoIosStats} from "react-icons/io";
import { useTranslation } from 'react-i18next';

export default function Statistics(): JSX.Element {

    const { t } = useTranslation();

    const mockdata = [
        {title: t('statistics.success'), value: 10, color: '#50C878'},
        {title: t('statistics.failed'), value: 15, color: '#C13C37'},
        {title: t('statistics.nothing_yet'), value: 20, color: '#D3D3D3'},
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
            <button className="js-modal-trigger button is-primary is-pulled-right" onClick={openModal}>
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
                        <PieChart
                            label={({dataEntry}) => `${dataEntry.title}: ${Math.round(dataEntry.percentage)} %`}
                            labelStyle={() => ({
                                fontSize: '5px',
                            })}
                            segmentsShift={0.2}
                            radius={45}
                            data={mockdata}
                        />
                    </section>
                    <footer className="modal-card-foot"/>
                </div>
            </div>
        </>
    )
}