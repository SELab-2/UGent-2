import {JSX, useState} from "react";
import {CiLink} from "react-icons/ci";
import {RegularButton} from "./RegularButton.tsx";
import {useTranslation} from "react-i18next";

export default function CopyLink(): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const { t } = useTranslation();

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <>
            <button className="js-modal-trigger button is-rounded" onClick={changeModal}>
                <CiLink size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t('popups.share')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            {t('popups.share_warning')}
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={`${t('popups.share_link')}`} add={false} styling={"is-success"} onClick={() => {}}/>
                    </footer>
                </div>
            </div>
        </>
    )
}
