import React, {JSX, useState} from 'react';
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
import apiFetch from "../../utils/ApiFetch.ts";
import useAuth from "../../hooks/useAuth.ts";


function filter_on_not_role(users: User[], role: string): User[] {
    return users.filter((user) => !user.user_roles.includes(role));
}

async function adjust_role(typeOperation: OperationType, person: User, current_user_id: (number | undefined), role: string, setUsers: React.Dispatch<React.SetStateAction<User[]>>) {
    let roles: string[];

    switch (typeOperation) {
        case OperationType.ADD:
            roles = [...person.user_roles, role];
            break;
        case OperationType.REMOVE:
            roles = person.user_roles.filter(r => r !== role);
            break;
        default:
            roles = person.user_roles;
    }

    const response = await apiFetch(`/users/${person.user_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roles)
    });

    if (response.ok) {
        setUsers(prevUsers => prevUsers.map(u =>
            u.user_id === person.user_id ? {...u, user_roles: roles} : u
        ));
        if (current_user_id === person.user_id) {
            window.location.reload();
        }
    }
}

export default function HomeAdmin(): JSX.Element {

    const data: AdminLoaderObject = useRouteLoaderData(ADMIN_LOADER) as AdminLoaderObject
    const [users, setUsers] = useState(data.users);
    const non_teachers = filter_on_not_role(users, "TEACHER")
    const {user} = useAuth()

    const {t} = useTranslation();

    function renderForTeacher(person: User) {

        if (!(person.user_roles.includes("TEACHER"))) {
            return (
                <div className="person">
                    <Person name={person.user_name} operations={[
                        <OperationButton key={getKey()} type={OperationType.ADD}
                                         action={() => void adjust_role(OperationType.ADD, person, user?.user_id, "TEACHER", setUsers)}/>,
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
                        <OperationButton key={getKey()} type={OperationType.REMOVE}
                                         action={() => void adjust_role(OperationType.REMOVE, person, user?.user_id, "ADMIN", setUsers)}/>,
                    ]}/>
                </div>
            )
        }

        return (
            <div className="person">
                <Person name={person.user_name} operations={[
                    <OperationButton key={getKey()} type={OperationType.ADD}
                                     action={() => void adjust_role(OperationType.ADD, person, user?.user_id, "ADMIN", setUsers)}/>,
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
