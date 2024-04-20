import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/students_components.css'
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table} from "../../components/Table.tsx";
import {TableRowCourses} from "../../types/tableRows.ts";
import {useRouteLoaderData} from "react-router-dom";
import {COURSES_STUDENT_ROUTER_ID, coursesStudentLoaderObject} from "../../dataloaders/CoursesStudentLoader.ts";
import { useTranslation } from 'react-i18next';
import {properCourse} from "../../utils/ApiInterfaces.ts";

export default function CoursesViewStudent(): JSX.Element {

    const { t } = useTranslation();

    const data: coursesStudentLoaderObject = useRouteLoaderData(COURSES_STUDENT_ROUTER_ID) as coursesStudentLoaderObject
    const courses_data = data.courses

    const tableCoursesActive: TableRowCourses[] = courses_data.map((course: properCourse) => {

        const deadline_date = course.first_deadline ? new Date(course.first_deadline) : null

        let deadline = null
        if (deadline_date){
            deadline = `${deadline_date.getHours()}:${deadline_date.getMinutes()} - ${deadline_date.getDate()}/${deadline_date.getMonth()}/${deadline_date.getFullYear()}`
        }

        return{
            course: {
                name: course.course_name,
                id: course.course_id,
            },
            shortestDeadline: deadline,
            numberOfProjects: course.active_projects
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
                        <SearchBar placeholder={t('courses.search_placeholder')}/>
                        <Table title={t('courses.active')} data={tableCoursesActive} ignoreKeys={[]} home={"student"}/>
                    </div>
                </div>
            </div>
        </>
    )
}