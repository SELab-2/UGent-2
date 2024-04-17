import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/admin.css'
import { SearchBar } from "../../components/SearchBar.tsx";
import { Person } from "./Person.tsx";
import { OperationButton } from "./OperationButton.tsx";
import { Roles, admin_test_data, teacher_test_data } from "./test_data.tsx";
import { OperationType } from "../../others/enums.tsx";
import { getKey } from "../../others/key_generator.tsx";
import { useTranslation } from 'react-i18next';

export default function HomeAdmin(): JSX.Element {

    const { t } = useTranslation();

    function renderForTeacher(person: {
        name: string,
        roles: Roles[],
        /* [key: string]: any; */
    }) {
        
        if (! (person.roles.includes(Roles.TEACHER))) {
            return (
                <div className="person">
                    <Person name={person.name} operations={[
                        <OperationButton key={getKey()} type={OperationType.ADD} action={function() { return undefined; }}/>,
                    ]} />
                </div>
            )
        }

        return (<></>)
    }

    function renderForAdmin(person: {
        name: string,
        roles: Roles[],
        /* [key: string]: any; */
    }) {
        
        /* Check if admin first. */
        if (person.roles.includes(Roles.ADMIN)) {
            return (
                <div className="person">
                    <Person name={person.name} operations={[
                        <OperationButton key={getKey()} type={OperationType.REMOVE} action={function() { return undefined; }}/>,
                    ]} />
                </div>
            )
        }

        return (
            <div className="person">
                <Person name={person.name} operations={[
                    <OperationButton key={getKey()} type={OperationType.ADD} action={function() { return undefined; }}/>,
                ]} />
            </div>
        )
    }

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('admin.title')} home={"admin"}/>
            </div>
            <div className={"main-content"}>
                <div className={"side-bar"}>
                    <Sidebar home={"admin"} buttons={[]}/>
                </div>
                <div className={"admin-main"}>
                    <div className={"rights-list"}>
                        <div className={"rights-block"}>
                            <p className={"explanation"}>
                                <p className={"main"}>{t('admin.teacher_rights.tag')}</p>
                                <p className={"sub"}>{t('admin.teacher_rights.sub')}</p>
                            </p>
                            <SearchBar placeholder={t('admin.search_placeholder')}></SearchBar>
                            <div className="person-list">
                                {teacher_test_data.map(person => (
                                    renderForTeacher(person)
                                ))}
                            </div>
                        </div>
                        <div className={"rights-block"}>
                            <p className={"explanation"}>
                                <p className={"main"}>{t('admin.admin_rights.tag')}</p>
                                <p className={"sub"}>{t('admin.admin_rights.sub')}</p>
                            </p>
                            <SearchBar placeholder={t('admin.search_placeholder')}></SearchBar>
                            <div className="person-list">
                                {admin_test_data.map(person => (
                                    renderForAdmin(person)
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
