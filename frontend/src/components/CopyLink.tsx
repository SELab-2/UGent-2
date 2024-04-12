import {JSX, useState} from "react";
import {CiLink} from "react-icons/ci";
import {RegularButton} from "./RegularButton.tsx";

export default function CopyLink(): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <>
            <button className="js-modal-trigger button is-rounded is-pulled-right" onClick={changeModal}>
                <CiLink size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Voeg studenten toe</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            Iedereen die deze link volgt en ingelogd is op dit systeem, zal als student toegevoegd worden aan het vak.
                            Deel deze link enkel met de personen die u wil toevoegen.
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={"genereer link"} add={false} onClick={() => {}}/>
                    </footer>
                </div>
            </div>
        </>
    )
}
