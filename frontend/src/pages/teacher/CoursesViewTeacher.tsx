import {JSX} from "react";
import {Table, TableRowCourses} from "../../components/Table.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {RegularATag} from "../../components/RegularATag.tsx";
import {COURSES_TEACHER_ROUTER_ID, coursesTeacherLoaderObject} from "../../dataloaders/CoursesTeacherLoader.ts";
import {useRouteLoaderData} from "react-router-dom";


export default function CoursesViewTeacher(): JSX.Element {
    const data = useRouteLoaderData(COURSES_TEACHER_ROUTER_ID) as coursesTeacherLoaderObject;
    console.log(data);

    const tableCoursesActive: TableRowCourses[] = [
        {
            name: "Information Security",
            shortestDeadline: "23:59 - 05/03/2024",
            numberOfProjects: 2
        },
        {
            name: "Rechtsgeschiedenis",
            shortestDeadline: "23:59 - 21/03/2024",
            numberOfProjects: 2
        },
    ];
    const tableCoursesArchived: TableRowCourses[] = [
        {
            name: "Moderne talen",
            shortestDeadline: null,
            numberOfProjects: null,
        }
    ];

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={"Courses"} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <div className={"is-flex is-align-items-center is-justify-content-space-between"}>
                            <SearchBar placeholder={"zoek een vak..."}/>
                            <RegularATag link={"teacher/courses/create"} text={"nieuw vak"} add={true}/>
                        </div>
                        <Table title={"actief"} data={tableCoursesActive} ignoreKeys={[]}/>
                        <div className={"my-5"}/>
                        <Table title={"gearchiveerd"} data={tableCoursesArchived}
                               ignoreKeys={["shortestDeadline", "numberOfProjects"]}/>
                    </div>
                </div>
            </div>
        </>
    )

}
