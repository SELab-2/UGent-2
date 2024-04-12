import {JSX, useState} from "react";
import {RegularButton} from "./RegularButton.tsx";

export default function RemoveWarning(): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <>
            <button className="js-modal-trigger button is-rounded is-small" onClick={changeModal}>
                Remove
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Bevestiging</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            Ben je zeker dat je deze persoon zijn lesgeverrechten wilt ontnemen voor dit vak?
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={"Ja"} add={false} color={"is-danger"} onClick={() => {
                        }}/>
                        <RegularButton placeholder={"Nee"} add={false} color={"is-info"} onClick={changeModal}/>
                    </footer>
                </div>
            </div>
        </>
    )
}
