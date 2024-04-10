import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table} from "../../components/Table.tsx";
import {TableRowProjects} from "../../types/tableRows.ts";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECTS_STUDENT_ROUTER_ID} from "../../dataloaders/ProjectsStudentLoader.ts";
import {studentLoaderObject} from "../../dataloaders/StudentLoader.ts";

export default function ProjectsViewStudent(): JSX.Element {

    const data: studentLoaderObject = useRouteLoaderData(PROJECTS_STUDENT_ROUTER_ID) as studentLoaderObject
    console.log(data.projects)

    const tableProjectsActive: TableRowProjects[] = [
        {
            project: {
                name: "Markov Decision Diagram",
                id: 1234
            },
            course: {
                name: "Automaten, berekenbaarheid & complexiteit",
                id: 9876
            },
            numberOfSubmissions: null,
            deadline: "17:00 - 23/02/2024",
            status: "FAILED"
        },
        {
            project: {
                name: "HPC",
                id: 4321
            },
            course: {
                name: "Computationele Biologie",
                id: 6789
            },
            numberOfSubmissions: null,
            deadline: "19:00 - 25/02/2024",
            status: "SUCCES"
        }
    ];

    const tableProjectsArchived: TableRowProjects[] = [
        {
            project: {
                name: "HPC",
                id: 5478
            },
            course: {
                name: "Computationele Biologie",
                id: 6789
            },
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
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <SearchBar placeholder={"zoek een project..."}/>
                        <Table title={"actief"} data={tableProjectsActive} ignoreKeys={["numberOfSubmissions"]} home={"student"}/>
                        <div className={"my-5"}/>
                        <Table title={"gearchiveerd"} data={tableProjectsArchived}
                               ignoreKeys={["numberOfSubmissions", "deadline"]} home={"student"}/>
                    </div>
                </div>
            </div>
        </>
    )
}


