import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import ProjectCardStudent from "./ProjectCardStudent.tsx";
import '../../assets/styles/students_components.css'
import DeadlineTable from "./DeadlineTable.tsx";
import {STUDENT_ROUTER_ID, studentLoaderObject} from "../../dataloaders/StudentLoader.ts";
import {useRouteLoaderData} from "react-router-dom";
import {CompleteProjectStudent} from "../../utils/ApiInterfaces.ts";
import { useTranslation } from 'react-i18next';

export function RenderProjectCards(props: {projects: CompleteProjectStudent[]}): JSX.Element {
    return (
        <>
            {props.projects.map((project) => {
                return <ProjectCardStudent key={project.project_id} project={project}/>
            })}
        </>
    )

}
export default function HomeStudent(): JSX.Element {
    const data: studentLoaderObject = useRouteLoaderData(STUDENT_ROUTER_ID) as studentLoaderObject
    const projects = data.projects

    const active_projects = projects.filter((project) => !project.project_archived && project.project_visible);

    const { t } = useTranslation();

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('home_student.title')} home={"student"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"student"}/>
                </div>
                <div className={"student-main is-flex"}>
                    <div className={"student-left px-5 py-5 mx-5 my-5 is-flex is-justify-content-space-evenly"}>
                        <RenderProjectCards projects={active_projects}/>
                    </div>
                    <div className={"student-right is-flex is-justify-content-center is-align-items-center"}>
                        <DeadlineTable projects={active_projects}/>
                    </div>
                </div>
            </div>
        </>
    )
}