import {JSX} from "react";
import {TableRowOverviewProjects, TableRowPeople} from "../../types/tableRows.ts";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {Table} from "../../components/Table.tsx";
import {useTranslation} from 'react-i18next';
import {useRouteLoaderData} from "react-router-dom";
import {COURSE_STUDENT} from "../../dataloaders/CourseStudentLoader.ts";
import DefaultErrorPage from "../../components/DefaultErrorPage.tsx";
import {deadline_to_string} from "../../utils/helper.ts";
import {CourseLoaderObject} from "../../utils/ApiInterfaces.ts";
import LeaveCourseStudent from "../../components/LeaveCourseStudent.tsx";

export default function CourseViewStudent(): JSX.Element {

    const { t } = useTranslation();

    const data: CourseLoaderObject = useRouteLoaderData(COURSE_STUDENT) as CourseLoaderObject
    const course_data = data.course

    if (!course_data) {
        return <DefaultErrorPage title={t("course_error.title")} body={t("course_error.text")}/>
    }

    const active_projects = course_data.all_projects?.filter(project => !project.project_archived && project.project_visible) ?? [];

    const tableProjects: TableRowOverviewProjects[] = active_projects.map(project => {
        return {
            project: {
                name: project.project_name,
                id: project.project_id
            },
            status: null,
            deadline: deadline_to_string(project.project_deadline)
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
                <Header page_title={course_data.course_name} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main is-flex is-flex-direction-column is-align-items-center"}>
                    <div className={"leave-course is-flex is-justify-content-end p-3"}>
                        <LeaveCourseStudent course_id={course_data.course_id}/>
                    </div>
                    <div className={"table-page is-flex is-flex-direction-column is-justify-content-center"}>
                        <div className={"my-3"}/>
                        <Table title={t('course.teachers')} data={teachers} ignoreKeys={["id"]} home={"student"}/>
                        {course_data.active_projects > 0 &&
                            <>
                                <div className={"my-5"}/>
                                <Table title={t('course.projects')} data={tableProjects} ignoreKeys={["status"]}
                                       home={"student"}/>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>

    )
}