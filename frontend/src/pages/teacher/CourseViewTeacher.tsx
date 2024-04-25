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
import LeaveCourse from "../../components/LeaveCourse.tsx";
import {CourseLoaderObject} from "../../dataloaders/loader_helpers/SharedFunctions.ts";
import {useRouteLoaderData} from "react-router-dom";
import {COURSE_TEACHER} from "../../dataloaders/CourseTeacherLoader.ts";

export default function CourseViewTeacher(): JSX.Element {
    const data: CourseLoaderObject = useRouteLoaderData(COURSE_TEACHER) as CourseLoaderObject;
    console.log(data)

    const { t } = useTranslation();

    if (!data || !data.course) {
        return <></>
    }

    const tableProjects: TableRowOverviewProjects[] = data.course.all_projects?.map((project) => {
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

    const teachers: TableRowPeople[] = data.course.teachers.map((teacher) => {
        return{
            name: teacher.name,
            email: teacher.email
        }
    });

    const students: TableRowPeople[] = data.course.students.map((student) => {
        return{
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
                        <div className={"is-flex is-align-items-center is-justify-content-space-between"}>
                            <div className={"my-5 is-flex"}>
                                <RegularATag link={"teacher/projects/create"} text={t('course.new_project')} add={true}/>
                                <div className={"ml-4 mr-2"}><CopyLink/></div>
                                <div className={"mx-2"}><ManageCourse teachers={teachers}/></div>
                                <div className={"mx-2"}><Archive/></div>
                            </div>
                            <LeaveCourse amountOfTeachers={teachers.length}/>
                        </div>
                        <div className={"my-5"}/>
                        <Table title={t('course.projects')} data={tableProjects} ignoreKeys={["status"]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={t('course.teachers')} data={teachers} ignoreKeys={[]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={t('course.students')} data={students} ignoreKeys={[]} home={"teacher"}/>
                    </div>
                </div>
            </div>
        </>
    )
}