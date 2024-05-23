import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/students_components.css'
import {Table} from "../../components/Table.tsx";
import {TableRowCourses} from "../../types/tableRows.ts";
import {useRouteLoaderData} from "react-router-dom";
import {COURSES_STUDENT_ROUTER_ID, coursesStudentLoaderObject} from "../../dataloaders/CoursesStudentLoader.ts";
import {useTranslation} from 'react-i18next';
import {properCourse} from "../../utils/ApiInterfaces.ts";
import {deadline_to_string} from "../../utils/helper.ts";

export default function CoursesViewStudent(): JSX.Element {

    const {t} = useTranslation();

    const data: coursesStudentLoaderObject = useRouteLoaderData(COURSES_STUDENT_ROUTER_ID) as coursesStudentLoaderObject

    const courses_data = data.courses

    const active_courses = courses_data.filter((course: properCourse) => !course.course_archived)
    const archived_courses = courses_data.filter((course: properCourse) => course.course_archived)

    const tableCoursesActive: TableRowCourses[] = active_courses.map((course: properCourse) => {

        const deadline_date = course.first_deadline ? new Date(course.first_deadline) : null

        let deadline = null
        if (deadline_date !== null) {
            deadline = deadline_to_string(deadline_date)
        } else {
            deadline = "-"
        }

        return {
            course: {
                name: course.course_name,
                id: course.course_id,
            },
            firstUpcomingDeadline: deadline,
            numberOfProjects: course.active_projects
        }
    })

    const tableCoursesArchived: TableRowCourses[] = archived_courses.map((course: properCourse) => {
        return {
            course: {
                name: course.course_name,
                id: course.course_id,
            },
            firstUpcomingDeadline: "-",
            numberOfProjects: 0
        }
    })

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('courses.title')} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <Table title={t('courses.active')} data={tableCoursesActive} ignoreKeys={[]} home={"student"}/>
                        <div className={"my-5"}/>
                        <Table title={t('courses.archived')} data={tableCoursesArchived}
                               ignoreKeys={["firstUpcomingDeadline", "numberOfProjects"]}
                               home={"student"}/>
                    </div>
                </div>
            </div>
        </>
    )
}