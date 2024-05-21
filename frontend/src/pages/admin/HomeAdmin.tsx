import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/admin.css'
import {Person} from "./Person.tsx";
import {OperationButton} from "./OperationButton.tsx";
import {OperationType} from "../../others/enums.tsx";
import {getKey} from "../../others/key_generator.tsx";
import {useTranslation} from 'react-i18next';
import {useRouteLoaderData} from "react-router-dom";
import {ADMIN_LOADER, AdminLoaderObject} from "../../dataloaders/AdminLoader.ts";
import {User} from "../../utils/ApiInterfaces.ts";


function filter_on_not_role(users: User[], role: string): User[] {
    return users.filter((user) => !user.user_roles.includes(role));
}

export default function HomeAdmin(): JSX.Element {

    const data: AdminLoaderObject = useRouteLoaderData(ADMIN_LOADER) as AdminLoaderObject
    const users = data.users
    const non_teachers = filter_on_not_role(users, "TEACHER")

    const {t} = useTranslation();

    function renderForTeacher(person: User) {

        if (!(person.user_roles.includes("TEACHER"))) {
            return (
                <div className="person">
                    <Person name={person.user_name} operations={[
                        <OperationButton key={getKey()} type={OperationType.ADD} action={function () {
                            return undefined;
                        }}/>,
                    ]}/>
                </div>
            )
        }

        return (<></>)
    }

    function renderForAdmin(person: User) {

        /* Check if admin first. */
        if (person.user_roles.includes("ADMIN")) {
            return (
                <div className="person">
                    <Person name={person.user_name} operations={[
                        <OperationButton key={getKey()} type={OperationType.REMOVE} action={function () {
                            return undefined;
                        }}/>,
                    ]}/>
                </div>
            )
        }

        return (
            <div className="person">
                <Person name={person.user_name} operations={[
                    <OperationButton key={getKey()} type={OperationType.ADD} action={function () {
                        return undefined;
                    }}/>,
                ]}/>
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
                            <div className="person-list">
                                {non_teachers.map(person => (
                                    renderForTeacher(person)
                                ))}
                            </div>
                        </div>
                        <div className={"rights-block"}>
                            <p className={"explanation"}>
                                <p className={"main"}>{t('admin.admin_rights.tag')}</p>
                                <p className={"sub"}>{t('admin.admin_rights.sub')}</p>
                            </p>
                            <div className="person-list">
                                {users.map(person => (
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
