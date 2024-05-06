import {JSX, useState} from "react";
import {RegularButton} from "./RegularButton.tsx";
import {IoExitOutline} from "react-icons/io5";
import {useTranslation} from "react-i18next";

export default function LeaveCourse(props: {amountOfTeachers: number}): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const { t } = useTranslation();

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <>
            <button className="js-modal-trigger button is-danger" onClick={changeModal}>
                <IoExitOutline size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t('popups.leave_course')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        { props.amountOfTeachers == 1 &&
                            <p>
                                {t('popups.leave_last_teacher')}
                            </p>
                        }
                        <p>
                            {t('popups.leave_question')}
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={t('popups.yes')} add={false} styling={"is-danger"} onClick={() => {
                        }}/>
                        <RegularButton placeholder={t('popups.no')} add={false} styling={"is-info"} onClick={changeModal}/>
                    </footer>
                </div>
            </div>
        </>
    )
}
