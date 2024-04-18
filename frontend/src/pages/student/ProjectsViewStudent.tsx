import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {SearchBar} from "../../components/SearchBar.tsx";
import {Table} from "../../components/Table.tsx";
import {TableRowProjects} from "../../types/tableRows.ts";
import {useRouteLoaderData} from "react-router-dom";
import {PROJECTS_STUDENT_ROUTER_ID} from "../../dataloaders/ProjectsStudentLoader.ts";
import {studentLoaderObject} from "../../dataloaders/StudentLoader.ts";
import {CompleteProjectStudent, SUBMISSION_STATE} from "../../utils/ApiInterfaces.ts";
import {ProjectStatus} from "../../types/project.ts";
import {useTranslation} from 'react-i18next';

function GenerateTableRowProjects(data: CompleteProjectStudent[]): TableRowProjects[] {

    const { t } = useTranslation();

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

        const deadline_date = new Date(project_item.project_deadline)
        const deadline = `${deadline_date.getHours()}:${deadline_date.getMinutes()} - ${deadline_date.getDate()}/${deadline_date.getMonth()}/${deadline_date.getFullYear()}`

        return {
            project: {
                name: project_item.project_name,
                id: project_item.project_id
            },
            course: {
                name: project_item.subject_name,
                id: project_item.subject_id
            },
            numberOfSubmissions: null,
            deadline: deadline,
            status: project_status
        }
    })
}

export default function ProjectsViewStudent(): JSX.Element {

    const data: studentLoaderObject = useRouteLoaderData(PROJECTS_STUDENT_ROUTER_ID) as studentLoaderObject
    const projects_data = data.projects

    const active_projects = projects_data.filter((project) => project.project_visible && !project.project_archived)

    const { t } = useTranslation();

    const tableProjectsActive: TableRowProjects[] = GenerateTableRowProjects(active_projects)

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
                        <SearchBar placeholder={t('projects.search_placeholder')}/>
                        <Table title={t('projects.active')} data={tableProjectsActive} ignoreKeys={["numberOfSubmissions"]}
                               home={"student"}/>
                        <div className={"my-5"}/>
                    </div>
                </div>
            </div>
        </>
    )
}


