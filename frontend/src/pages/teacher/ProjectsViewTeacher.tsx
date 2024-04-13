import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table, TableRowProjects} from "../../components/Table.tsx";
import {RegularATag} from "../../components/RegularATag.tsx";
import {useRouteLoaderData} from "react-router-dom";
import {teacherLoaderObject} from "../../dataloaders/TeacherLoader.ts";
import {PROJECTS_TEACHER_ROUTER_ID} from "../../dataloaders/projectsTeacherLoader.ts";

export default function ProjectsViewTeacher(): JSX.Element {
    const tableProjectsActive: TableRowProjects[] = [
        {
            name: "RSA security",
            course: "Information Security",
            status: null,
            numberOfSubmissions: 35,
            deadline: "23:59 - 23/02/2024"
        },
        {
            name: "Bachelorproef",
            course: "Rechtsgeschiedenis",
            status: null,
            numberOfSubmissions: 3,
            deadline: "23:59 - 21/03/2024"
        }
    ];

    const data: teacherLoaderObject = useRouteLoaderData(PROJECTS_TEACHER_ROUTER_ID) as teacherLoaderObject
    console.log(data.projects)

    const tableProjectsHidden: TableRowProjects[] = [];

    const tableProjectsArchived: TableRowProjects[] = [
        {
            name: "samenvatting \"The Social Contract\"",
            course: "Rechtsgeschiedenis",
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
                        <Table title={"actief"} data={tableProjectsActive} ignoreKeys={["status"]}/>
                        <div className={"my-5"}/>
                        <Table title={"verborgen"} data={tableProjectsHidden}
                               ignoreKeys={["status", "numberOfSubmissions"]}/>
                        <div className={"my-5"}/>
                        <Table title={"gearchiveerd"} data={tableProjectsArchived}
                               ignoreKeys={["status", "numberOfSubmissions", "deadline"]}/>
                    </div>
                </div>
            </div>
        </>
    )

}