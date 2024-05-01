import {JSX, useState} from "react";
import {RegularButton} from "./RegularButton.tsx";
import {FaArchive} from "react-icons/fa";
import {useTranslation} from "react-i18next";

export default function Archive(): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const { t } = useTranslation();

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <>
            <button className="js-modal-trigger button is-rounded is-pulled-right" onClick={changeModal}>
                <FaArchive size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t('popups.archive')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            {t('popups.archive_warning')}
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={`${t('popups.yes')}`} add={false} styling={"is-danger"} onClick={() => {}}/>
                        <RegularButton placeholder={`${t('popups.no')}`} add={false} styling={"is-info"} onClick={changeModal}/>
                    </footer>
                </div>
            </div>
        </>
    )
}
