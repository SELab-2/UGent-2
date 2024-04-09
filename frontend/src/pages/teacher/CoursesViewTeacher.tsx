import {JSX} from "react";
import {Table} from "../../components/Table.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {RegularATag} from "../../components/RegularATag.tsx";
import {TableRowCourses} from "../../types/tableRows.ts";

// import {useRouteLoaderData} from "react-router-dom";
// import {SUBJECT_TEACHER_ROUTER_ID, subjectsTeacherLoaderObject} from "../../dataloaders/SubjectsTeacherLoader.ts";


export default function CoursesViewTeacher(): JSX.Element {
    // const data= useRouteLoaderData(SUBJECT_TEACHER_ROUTER_ID) as subjectsTeacherLoaderObject;
    // console.log(data);

    const tableCoursesActive: TableRowCourses[] = [
        {
            course: {
                name: "Information Security",
                id: 5241
            },
            shortestDeadline: "23:59 - 05/03/2024",
            numberOfProjects: 2
        },
        {
            course: {
                name: "Rechtsgeschiedenis",
                id: 5897
            },
            shortestDeadline: "23:59 - 21/03/2024",
            numberOfProjects: 2
        },
    ];
    const tableCoursesArchived: TableRowCourses[] = [
        {
            course: {
                name: "Moderne talen",
                id: 5896
            },
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
                        <Table title={"actief"} data={tableCoursesActive} ignoreKeys={[]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={"gearchiveerd"} data={tableCoursesArchived}
                               ignoreKeys={["shortestDeadline", "numberOfProjects"]} home={"teacher"}/>
                    </div>
                </div>
            </div>
        </>
    )

}
