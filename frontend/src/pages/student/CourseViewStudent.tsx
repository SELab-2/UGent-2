import {JSX} from "react";
import {TableRowOverviewProjects, TableRowPeople} from "../../types/tableRows.ts";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {Table} from "../../components/Table.tsx";
import {useRouteLoaderData} from "react-router-dom";
import {CourseLoaderObject} from "../../dataloaders/loader_helpers/SharedFunctions.ts";
import {COURSE_STUDENT} from "../../dataloaders/CourseStudentLoader.ts";

export default function CourseViewStudent(): JSX.Element {

    const data: CourseLoaderObject = useRouteLoaderData(COURSE_STUDENT) as CourseLoaderObject
    const course_data = data.course

    if (!course_data) {
        return <>
            there was an error loading the course
        </>
    }

    const active_projects = course_data.all_projects?.filter(project => !project.project_archived && project.project_visible) ?? [];

    const tableProjects: TableRowOverviewProjects[] = active_projects.map(project => {
        const deadline_date = new Date(project.project_deadline)
        const deadline = `${deadline_date.getHours()}:${deadline_date.getMinutes()} - ${deadline_date.getDate()}/${deadline_date.getMonth()}/${deadline_date.getFullYear()}`

        return {
            project: {
                name: project.project_name,
                id: project.project_id
            },
            status: null,
            deadline: deadline
        }
    }) ?? [];

    const teachers: TableRowPeople[] = course_data.teachers.map(teacher => {
        return {
            name: teacher.name,
            email: teacher.email
        }
    });

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={course_data.subject_name} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <div className={"my-5"}/>
                        <Table title={"lesgevers"} data={teachers} ignoreKeys={[]} home={"student"}/>
                        {course_data.active_projects > 0 &&
                            <>
                                <div className={"my-5"}/>
                                <Table title={"projecten"} data={tableProjects} ignoreKeys={["status"]}
                                       home={"student"}/>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>

    )
}