import {JSX, useState} from "react";
import {RegularButton} from "./RegularButton.tsx";
import {FaArchive} from "react-icons/fa";

export default function Archive(): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

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
                        <p className="modal-card-title">Archiveer vak</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            Voor iedere student en lesgever van dit vak, zal dit vak ook gearchiveerd worden.
                            Er zullen geen projecten meer aangemaakt kunnen worden en actieve projecten zullen
                            afgesloten.
                            Bent u zeker dat u dit vak wil archiveren?
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={"Ja"} add={false} onClick={() => {}}/>
                        <RegularButton placeholder={"Nee"} add={false} onClick={() => {}}/>
                    </footer>
                </div>
            </div>
        </>
    )
}
