import {JSX} from "react";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import '../../assets/styles/students_components.css'
import DeadlineTable from "./DeadlineTable.tsx";
import {STUDENT_ROUTER_ID, studentLoaderObject} from "../../dataloaders/StudentLoader.ts";
import {useRouteLoaderData} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import RenderProjectCards from "../../others/helper.tsx";

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
                        { active_projects.length == 0 ?
                            <div className={"empty-page is-flex is-align-items-center"}>
                                <p>{t('empty-home.empty-cards')}</p>
                            </div>
                            :
                            <RenderProjectCards projects={active_projects}/>
                        }
                    </div>
                    <div className={"student-right is-flex is-justify-content-center is-align-items-center"}>
                        <DeadlineTable projects={active_projects}/>
                    </div>
                </div>
            </div>
        </>
    )
}