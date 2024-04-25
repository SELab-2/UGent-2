import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table} from "../../components/Table.tsx";
import {RegularATag} from "../../components/RegularATag.tsx";
import {TableRowProjects} from "../../types/tableRows.ts";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECTS_TEACHER_ROUTER_ID, projectsTeacherLoaderObject} from "../../dataloaders/ProjectsTeacherLoader.ts";
import {useTranslation} from 'react-i18next';
import {CompleteProjectTeacher} from "../../utils/ApiInterfaces.ts";


function GenerateTableRowProjects(data: CompleteProjectTeacher[]): TableRowProjects[] {
    return data.map((project_item) => {
        const deadline_date = new Date(project_item.project_deadline)
        const deadline = `${deadline_date.getHours()}:${deadline_date.getMinutes()} - ${deadline_date.getDate()}/${deadline_date.getMonth()}/${deadline_date.getFullYear()}`
        console.log(project_item.project_name, project_item.submission_amount)
        return {
            project: {
                name: project_item.project_name,
                id: project_item.project_id
            },
            course: {
                name: project_item.course_name,
                id: project_item.course_id
            },
            status: null,
            numberOfSubmissions: project_item.submission_amount,
            deadline: deadline,
        }
    })
}
export default function ProjectsViewTeacher(): JSX.Element {

    const data: projectsTeacherLoaderObject = useRouteLoaderData(PROJECTS_TEACHER_ROUTER_ID) as projectsTeacherLoaderObject

    const active_projects = data.projects.filter((project) => !project.project_archived && project.project_visible);
    const hidden_projects = data.projects.filter((project) => !project.project_archived && !project.project_visible);
    const archived_projects = data.projects.filter((project) => project.project_archived);

    const { t } = useTranslation();

    const tableProjectsActive: TableRowProjects[] = GenerateTableRowProjects(active_projects);
    const tableProjectsHidden: TableRowProjects[] = GenerateTableRowProjects(hidden_projects);
    const tableProjectsArchived: TableRowProjects[] = GenerateTableRowProjects(archived_projects);

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('projects.title')} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <div className={"is-flex is-align-items-center is-justify-content-space-between"}>
                            <SearchBar placeholder={"zoek een project..."}/>
                            <RegularATag link={"teacher/projects/create"} text={t('projects.new_project')} add={true}/>
                        </div>
                        <Table title={t('projects.active')} data={tableProjectsActive} ignoreKeys={["status"]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={t('projects.hidden')} data={tableProjectsHidden}
                               ignoreKeys={["status", "numberOfSubmissions"]} home={"teacher"}/>
                        <div className={"my-5"}/>
                        <Table title={t('projects.archived')} data={tableProjectsArchived}
                               ignoreKeys={["status", "numberOfSubmissions", "deadline"]} home={"teacher"}/>
                    </div>
                </div>
            </div>
        </>
    )

}