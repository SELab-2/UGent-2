import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table, TableRowProjects} from "../../components/Table.tsx";

export default function ProjectsViewStudent(): JSX.Element {
    const tableProjectsActive: TableRowProjects[] = [
        {
            name: "Markov Decision Diagram",
            course: "Automaten, berekenbaarheid & complexiteit",
            numberOfSubmissions: null,
            deadline: "17:00 - 23/02/2024",
            status: "FAILED"
        },
        {
            name: "HPC",
            course: "Computationele Biologie",
            numberOfSubmissions: null,
            deadline: "19:00 - 25/02/2024",
            status: "SUCCES"
        }
    ];

    const tableProjectsArchived: TableRowProjects[] = [
        {
            name: "HPC",
            course: "Computationele Biologie",
            numberOfSubmissions: null,
            deadline: null,
            status: "SUCCES"
        }
    ];

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Projects"} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <SearchBar placeholder={"zoek een vak..."}/>
                        <Table title={"actief"} data={tableProjectsActive} ignoreKeys={["numberOfSubmissions"]}/>
                        <div className={"my-5"}/>
                        <Table title={"gearchiveerd"} data={tableProjectsArchived} ignoreKeys={["numberOfSubmissions", "deadline"]}/>
                    </div>
                </div>
            </div>
        </>
    )
}


