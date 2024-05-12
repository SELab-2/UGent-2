import {JSX, useState} from "react";
import {RegularButton} from "./RegularButton.tsx";
import {useTranslation} from "react-i18next";

export default function RemoveWarning(): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const {t} = useTranslation();

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <td>
            <button className="js-modal-trigger button is-rounded is-small" onClick={changeModal}>
                -
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t('popups.confirmation')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            {t('popups.confirm_delete')}
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={t('popups.yes')} add={false} styling={"is-danger"}
                                       onClick={() => {
                                       }}/>
                        <RegularButton placeholder={t('popups.no')} add={false} styling={"is-info"}
                                       onClick={changeModal}/>
                    </footer>
                </div>
            </div>
        </td>
    )
}
