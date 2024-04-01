import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/students_components.css'
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table, TableRowCourses} from "../../components/Table.tsx";

export default function CoursesViewStudent(): JSX.Element {

    const tableCoursesActive: TableRowCourses[] = [
        {
            name: "Automaten, berekenbaarheid & complexiteit",
            shortestDeadline: "17:00 - 23/02/2024",
            numberOfProjects: 1
        },
        {
            name: "Computationele Biologie",
            shortestDeadline: "19:00 - 25/02/2024",
            numberOfProjects: 2
        },
    ];
    const tableCoursesArchived: TableRowCourses[] = [
        {
            name: "Logisch Programmeren",
            shortestDeadline: null,
            numberOfProjects: 1,
        }
    ];

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Courses"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <SearchBar placeholder={"zoek een vak..."}/>
                        <Table title={"actief"} data={tableCoursesActive} ignoreKeys={[]}/>
                        <div className={"my-5"}/>
                        <Table title={"gearchiveerd"} data={tableCoursesArchived} ignoreKeys={["shortestDeadline"]}/>
                    </div>
                </div>
            </div>
        </>
    )
}