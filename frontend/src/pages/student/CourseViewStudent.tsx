import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/students_components.css'
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table} from "../../components/Table.tsx";
import {TableRowCourses} from "../../types/tableRows.ts";

export default function CoursesViewStudent(): JSX.Element {

    const tableCoursesActive: TableRowCourses[] = [
        {
            course: {
                name: "Automaten, berekenbaarheid & complexiteit",
                id: 5896
            },
            shortestDeadline: "17:00 - 23/02/2024",
            numberOfProjects: 1
        },
        {
            course: {
                name: "Computationele Biologie",
                id: 5741
            },
            shortestDeadline: "19:00 - 25/02/2024",
            numberOfProjects: 2
        },
    ];
    const tableCoursesArchived: TableRowCourses[] = [
        {
            course: {
                name: "Logisch Programmeren",
                id: 2569
            },
            shortestDeadline: null,
            numberOfProjects: 1,
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
                        <SearchBar placeholder={"zoek een vak..."}/>
                        <Table title={"actief"} data={tableCoursesActive} ignoreKeys={[]} home={"student"}/>
                        <div className={"my-5"}/>
                        <Table title={"gearchiveerd"} data={tableCoursesArchived} ignoreKeys={["shortestDeadline"]} home={"student"}/>
                    </div>
                </div>
            </div>
        </>
    )
}