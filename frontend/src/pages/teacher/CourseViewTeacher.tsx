import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {RegularATag} from "../../components/RegularATag.tsx";
import {Table} from "../../components/Table.tsx";
import {TableRowOverviewProjects, TableRowPeople} from "../../types/tableRows.ts";
import {useTranslation} from 'react-i18next';
import CopyLink from "../../components/CopyLink.tsx";
import Archive from "../../components/Archive.tsx";
import ManageCourse from "../../components/ManageCourse.tsx";
import LeaveCourseTeacher from "../../components/LeaveCourseTeacher.tsx";
import {useRouteLoaderData} from "react-router-dom";
import {COURSE_TEACHER} from "../../dataloaders/CourseTeacherLoader.ts";
import {deadline_to_string} from "../../utils/helper.ts";
import {CourseLoaderObject} from "../../utils/ApiInterfaces.ts";
import DefaultErrorPage from "../../components/DefaultErrorPage.tsx";

export default function CourseViewTeacher(): JSX.Element {
    const data: CourseLoaderObject = useRouteLoaderData(COURSE_TEACHER) as CourseLoaderObject;

    const {t} = useTranslation();

    if (!data || !data.course) {
        return <DefaultErrorPage title={t("course_error.title")} body={t("course_error.text")}/>
    }

    const tableProjects: TableRowOverviewProjects[] = data.course.all_projects?.map((project) => {
        return {
            project: {
                name: project.project_name,
                id: project.project_id
            },
            status: null,
            deadline: deadline_to_string(project.project_deadline)
        }
    }) ?? [];

    const teachers: { name: string, email: string, id: number }[] = data.course.teachers.map((teacher) => {
        return {
            name: teacher.name,
            email: teacher.email,
            id: teacher.user_id
        }
    });

    const students: TableRowPeople[] = data.course.students.map((student) => {
        return {
            name: student.name,
            email: student.email
        }
    });

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={data.course.course_name} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        {!data.course.course_archived &&
                            <div className={"is-flex is-align-items-center is-justify-content-space-between"}>
                                <div className={"my-5 is-flex"}>
                                    <RegularATag link={"teacher/projects/create"} text={t('course.new_project')}
                                                 add={true}/>
                                    <div className={"ml-4 mr-2"}><CopyLink
                                        link={`${window.location.protocol}//${window.location.host}/student/course/${data.course.course_id}/join`}/>
                                    </div>
                                    <div className={"mx-2"}><ManageCourse course_id={data.course.course_id}
                                                                          teachers={teachers}/></div>
                                    <div className={"mx-2"}><Archive course_id={data.course.course_id}
                                                                     course_name={data.course.course_name}/></div>
                                </div>
                                <LeaveCourseTeacher amountOfTeachers={teachers.length} course_id={data.course.course_id}
                                                    course_name={data.course.course_name}/>
                            </div>
                        }
                        <div className={"my-5"}/>
                        <Table title={t('course.projects')} data={tableProjects} ignoreKeys={["status"]}
                               home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={t('course.teachers')} data={teachers} ignoreKeys={["id"]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={t('course.students')} data={students} ignoreKeys={["id"]} home={"teacher"}/>
                    </div>
                </div>
            </div>
        </>
    )
}