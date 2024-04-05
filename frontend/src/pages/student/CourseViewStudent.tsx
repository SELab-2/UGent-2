import {JSX} from "react";
import {TableRowOverviewProjects, TableRowPeople} from "../../types/tableRows.ts";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {Table} from "../../components/Table.tsx";

export default function CourseViewStudent(): JSX.Element {
    const tableProjects: TableRowOverviewProjects[] = [
        {
            project: {
                name: "RSA security",
                id: 1234
            },
            status: null,
            deadline: "23:59 - 27/02/2024"
        },
        {
            project: {
                name: "Symmetric encryption",
                id: 5897
            },
            status: null,
            deadline: "23:59 - 03/03/2024"
        }
    ];

    const teachers: TableRowPeople[] = [
        {
            name: "Maarten Vermeiren",
            email: "maarten.vermeiren@ugent.be"
        },
        {
            name: "Anke De Groot",
            email: "anke.degroot@ugent.be"
        }
    ];

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Courses"} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <div className={"my-5"}/>
                        <Table title={"lesgevers"} data={teachers} ignoreKeys={[]} home={"student"}/>
                        <div className={"my-5"}/>
                        <Table title={"projecten"} data={tableProjects} ignoreKeys={["status"]} home={"student"}/>
                    </div>
                </div>
            </div>
        </>

    )
}