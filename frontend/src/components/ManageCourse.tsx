import {JSX, useState} from "react";
import {TableRowPeople} from "../types/tableRows.ts";
import {MdManageAccounts} from "react-icons/md";
import RemoveWarning from "./RemoveWarning.tsx";

export default function ManageCourse(props: { teachers: TableRowPeople[] }): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <>
            <button className="js-modal-trigger button is-rounded is-pulled-right" onClick={changeModal}>
                <MdManageAccounts size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Lesgevers</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <table className={"table is-fullwidth"}>
                            <thead>
                            <tr>
                                <th>Naam</th>
                                <th>Email</th>
                                <th>Verwijder</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.teachers.map((member, index) => {
                                return (<tr key={index}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <RemoveWarning/>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </>
    )
}
