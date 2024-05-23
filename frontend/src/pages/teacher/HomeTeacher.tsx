import {JSX} from "react";
import {TEACHER_ROUTER_ID, teacherLoaderObject} from "../../dataloaders/TeacherLoader.ts";
import {useRouteLoaderData} from "react-router-dom";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {useTranslation} from "react-i18next";
import RenderProjectCards from "../../others/helper.tsx";


export default function HomeTeacher(): JSX.Element {

    const data: teacherLoaderObject = useRouteLoaderData(TEACHER_ROUTER_ID) as teacherLoaderObject;

    const { t } = useTranslation();

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('home_teacher.title')} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"teacher-main is-flex"}>
                    <div className={"teacher-left px-5 py-5 mx-5 my-5 is-flex is-justify-content-space-evenly"}>
                        { data.projects.filter(project => !project.project_archived).length == 0 ?
                            <div className={"empty-page is-flex is-align-items-center"}>
                                <p>{t('empty-home.empty-cards')}</p>
                            </div>
                            :
                            <RenderProjectCards projects={data.projects} courses={data.courses}/>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}