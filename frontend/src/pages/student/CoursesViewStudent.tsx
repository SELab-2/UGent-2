import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/students_components.css'
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table, TableRowCourses} from "../../components/Table.tsx";

export default function CoursesViewStudent(): JSX.Element {

    const TableDataCoursesActive: TableRowCourses[] = [
        {
            name: "Automaten, berekenbaarheid & complexiteit",
            numberOfProjects: 1,
            shortestDeadline: "17:00 - 23/02/2024"
        },
        {
            name: "Computationele Biologie",
            numberOfProjects: 2,
            shortestDeadline: "19:00 - 25/02/2024"
        },
    ];
    const TableCoursesArchived: TableRowCourses[] = [
        {
            name: "Logisch Programmeren",
            numberOfProjects: 1,
            shortestDeadline: null,
        }
    ];

    return (
        <>
            <div className={"main-header"}>
                <Header/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <SearchBar placeholder={"zoek een vak..."}/>
                        <Table title={"actief"} data={TableDataCoursesActive}/>
                        <Table title={"gearchiveerd"} data={TableCoursesArchived}/>
                    </div>
                </div>
            </div>
        </>
    )
}