import {JSX} from "react";
import {Table} from "../../components/Table.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {RegularATag} from "../../components/RegularATag.tsx";
import {TableRowCourses} from "../../types/tableRows.ts";
import {COURSES_TEACHER_ROUTER_ID, coursesTeacherLoaderObject} from "../../dataloaders/CoursesTeacherLoader.ts";
import {useRouteLoaderData} from "react-router-dom";
import {useTranslation} from 'react-i18next';

export default function CoursesViewTeacher(): JSX.Element {

    const { t } = useTranslation();

    const data = useRouteLoaderData(COURSES_TEACHER_ROUTER_ID) as coursesTeacherLoaderObject;
    console.log(data.courses);

    const active_courses = data.courses.filter(course => !course.course_archived);
    const archived_courses = data.courses.filter(course => course.course_archived);

    const tableCoursesActive: TableRowCourses[] = active_courses.filter(course => course.first_deadline !== null).map(course => {

        const deadline_date = course.first_deadline ? new Date(course.first_deadline) : null

        let deadline = null
        if (deadline_date){
            deadline = `${deadline_date.getHours()}:${deadline_date.getMinutes()} - ${deadline_date.getDate()}/${deadline_date.getMonth()}/${deadline_date.getFullYear()}`
        }

        return {
            course: {
                name: course.course_name,
                id: course.course_id
            },
            shortestDeadline: deadline,
            numberOfProjects: course.active_projects
        }
    });


    const tableCoursesArchived: TableRowCourses[] = archived_courses.map(course => {

            return {
                course: {
                    name: course.course_name,
                    id: course.course_id
                },
                shortestDeadline: null,
                numberOfProjects: null
            }
    });

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('courses.title')} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <div className={"is-flex is-align-items-center is-justify-content-space-between"}>
                            <SearchBar placeholder={t('courses.search_placeholder')}/>
                            <RegularATag link={"teacher/courses/create"} text={t('courses.new_project')} add={true}/>
                        </div>
                        {active_courses.length > 0 &&
                        <>
                            <Table title={t('courses.active')} data={tableCoursesActive} ignoreKeys={[]} home={"teacher"}/>
                            <div className={"my-5"}/>
                        </>}
                        {archived_courses.length > 0 &&
                            <Table title={t('courses.archived')} data={tableCoursesArchived}
                                   ignoreKeys={["shortestDeadline", "numberOfProjects"]} home={"teacher"}/>
                        }
                    </div>
                </div>
            </div>
        </>
    )

}
