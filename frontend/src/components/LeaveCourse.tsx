import {JSX, useState} from "react";
import {RegularButton} from "./RegularButton.tsx";
import {IoExitOutline} from "react-icons/io5";

export default function LeaveCourse(props: {amountOfTeachers: number}): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

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
                        <p className="modal-card-title">Vak verlaten</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        { props.amountOfTeachers == 1 &&
                            <p>
                                U bent de laatste lesgever, dus zal het vak gearchiveerd worden voor alle studenten.
                            </p>
                        }
                        <p>
                            Bent u zeker dat u dit vak wil verlaten?
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={"Ja"} add={false} styling={"is-danger"} onClick={() => {
                        }}/>
                        <RegularButton placeholder={"Nee"} add={false} styling={"is-info"} onClick={changeModal}/>
                    </footer>
                </div>
            </div>
        </>
    )
}