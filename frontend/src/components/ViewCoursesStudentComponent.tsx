import {JSX} from "react";
import {SearchBar} from "./SearchBar.tsx";
import {Table, TableRowCourses} from "./Table.tsx";


export default function ViewCoursesStudentComponent(): JSX.Element {
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
        <div className={"table-page is-flex is-flex-direction-column"}>
            <SearchBar placeholder={"zoek een vak..."}/>
            <Table title={"actief"} data={TableDataCoursesActive}/>
            <Table title={"gearchiveerd"} data={TableCoursesArchived}/>
        </div>
    )
}