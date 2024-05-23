import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {Table} from "../../components/Table.tsx";
import {TableRowProjects} from "../../types/tableRows.ts";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECTS_STUDENT_ROUTER_ID} from "../../dataloaders/ProjectsStudentLoader.ts";
import {studentLoaderObject} from "../../dataloaders/StudentLoader.ts";
import {CompleteProjectStudent, SUBMISSION_STATE} from "../../utils/ApiInterfaces.ts";
import {ProjectStatus} from "../../types/project.ts";
import {useTranslation} from 'react-i18next';
import {deadline_to_string} from "../../utils/helper.ts";

function GenerateTableRowProjects(data: CompleteProjectStudent[]): TableRowProjects[] {

    const {t} = useTranslation();

    return data.map((project_item) => {

        let project_status: ProjectStatus.PENDING | ProjectStatus.SUCCESS | ProjectStatus.FAILED
        switch (project_item.submission_state) {
            case SUBMISSION_STATE.Rejected:
                project_status = t('projects.failed');
                break;
            case SUBMISSION_STATE.Approved:
                project_status = t('projects.success');
                break;
            default:
                project_status = t('projects.pending');
        }


        return {
            project: {
                name: project_item.project_name,
                id: project_item.project_id
            },
            course: {
                name: project_item.course_name,
                id: project_item.course_id
            },
            numberOfSubmissions: null,
            deadline: deadline_to_string(project_item.project_deadline) ?? "",
            status: project_status ?? null
        }
    })
}

export default function ProjectsViewStudent(): JSX.Element {

    const data: studentLoaderObject = useRouteLoaderData(PROJECTS_STUDENT_ROUTER_ID) as studentLoaderObject
    const projects_data = data.projects

    const active_projects = projects_data.filter((project) => project.project_visible && !project.project_archived)
    const archived_projects = projects_data.filter((project) => project.project_visible && project.project_archived)
    const {t} = useTranslation();

    const tableProjectsActive: TableRowProjects[] = GenerateTableRowProjects(active_projects)
    const tableProjectsArchived: TableRowProjects[] = GenerateTableRowProjects(archived_projects)

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('projects.title')} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main is-flex is-justify-content-center"}>
                    <div className={"table-page is-flex is-flex-direction-column"}>
                        <Table title={t('projects.active')} data={tableProjectsActive}
                               ignoreKeys={["numberOfSubmissions"]}
                               home={"student"}/>
                        <div className={"my-5"}/>
                        <Table title={t('projects.archived')} data={tableProjectsArchived}
                               ignoreKeys={["numberOfSubmissions", "deadline", "status"]}
                               home={"student"}/>
                        <div className={"my-5"}/>
                    </div>
                </div>
            </div>
        </>
    )
}


