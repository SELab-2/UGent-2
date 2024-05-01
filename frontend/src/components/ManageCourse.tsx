import {JSX, useState} from "react";
import {TableRowPeople} from "../types/tableRows.ts";
import {MdManageAccounts} from "react-icons/md";
import RemoveWarning from "./RemoveWarning.tsx";
import {SearchBar} from "./SearchBar.tsx";
import AddWarning from "./AddWarning.tsx";
import {useTranslation} from "react-i18next";

export default function ManageCourse(props: { teachers: TableRowPeople[] }): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const { t } = useTranslation();

    const searched: TableRowPeople[] = [
        {
            name: "Anita Verloor",
            email: "anita.verloor@ugent.be"
        },
        {
            name: "Anita Pelemans",
            email: "anita.pelemans@ugent.be"
        }
    ]

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
                        <p className="modal-card-title">{t('popups.teachers')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body pb-6">
                        <SearchBar placeholder={`${t('searchbar.find_teacher')}`}/>
                        <table className={"table is-fullwidth"}>
                            <thead>
                            <tr>
                                <th>{t('table.name')}</th>
                                <th>{t('table.email')}</th>
                                <th>{t('table.add')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {searched.map((member, index) => {
                                return (<tr key={index}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <AddWarning/>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                        <div className={"py-5"}/>
                        <table className={"table is-fullwidth"}>
                            <thead>
                            <tr>
                                <th>{t('table.name')}</th>
                                <th>{t('table.email')}</th>
                                <th>{t('table.remove')}</th>
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
