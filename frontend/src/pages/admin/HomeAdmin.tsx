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

export default function HomeAdmin(): JSX.Element {

    const placeholder = "Zoek persoon"
    const teacher_main = "Geef lesgever-rechten:"
    const teacher_sub = "(kies tussen alle niet-lesgevers)"
    const admin_main = "Verander admin-rechten:"
    const admin_sub = "(kies tussen alle personen)"

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
                <Header page_title={"Admin"} home={"admin"}/>
            </div>
            <div className={"main-content"}>
                <div className={"side-bar"}>
                    <Sidebar home={"admin"} buttons={[]}/>
                </div>
                <div className={"admin-main"}>
                    <div className={"rights-list"}>
                        <div className={"rights-block"}>
                            <p className={"explanation"}>
                                <p className={"main"}>{teacher_main}</p>
                                <p className={"sub"}>{teacher_sub}</p>
                            </p>
                            <SearchBar placeholder={placeholder}></SearchBar>
                            <div className="person-list">
                                {teacher_test_data.map(person => (
                                    renderForTeacher(person)
                                ))}
                            </div>
                        </div>
                        <div className={"rights-block"}>
                            <p className={"explanation"}>
                                <p className={"main"}>{admin_main}</p>
                                <p className={"sub"}>{admin_sub}</p>
                            </p>
                            <SearchBar placeholder={placeholder}></SearchBar>
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
