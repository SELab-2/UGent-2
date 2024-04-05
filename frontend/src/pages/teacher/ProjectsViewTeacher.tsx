import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table} from "../../components/Table.tsx";
import {RegularATag} from "../../components/RegularATag.tsx";
import {TableRowProjects} from "../../types/tableRows.ts";

export default function ProjectsViewTeacher(): JSX.Element {
    const tableProjectsActive: TableRowProjects[] = [
        {
            project: {
                name: "RSA security",
                id: 1478
            },
            course: {
                name: "Information Security",
                id: 9632,
            },
            status: null,
            numberOfSubmissions: 35,
            deadline: "23:59 - 23/02/2024"
        },
        {
            project: {
                name: "Bachelorproef",
                id: 7536
            },
            course: {
                name: "Rechtsgeschiedenis",
                id: 4521,
            },
            status: null,
            numberOfSubmissions: 3,
            deadline: "23:59 - 21/03/2024"
        }
    ];

    const tableProjectsHidden: TableRowProjects[] = [];

    const tableProjectsArchived: TableRowProjects[] = [
        {
            project: {
                name: "samenvatting \"The Social Contract\"",
                id: 6874
            },
            course: {
                name: "Rechtsgeschiedenis",
                id: 4521,
            },
            status: null,
            numberOfSubmissions: null,
            deadline: null
        }
    ];


    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Projects"} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <div className={"is-flex is-align-items-center is-justify-content-space-between"}>
                            <SearchBar placeholder={"zoek een project..."}/>
                            <RegularATag link={"teacher/projects/create"} text={"nieuw project"} add={true}/>
                        </div>
                        <Table title={"actief"} data={tableProjectsActive} ignoreKeys={["status"]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={"verborgen"} data={tableProjectsHidden}
                               ignoreKeys={["status", "numberOfSubmissions"]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={"gearchiveerd"} data={tableProjectsArchived}
                               ignoreKeys={["status", "numberOfSubmissions", "deadline"]} home={"teacher"}/>
                    </div>
                </div>
            </div>
        </>
    )

}