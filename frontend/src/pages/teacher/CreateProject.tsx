import {JSX} from "react";
import {ProjectTeacherComponent} from "../../components/ProjectTeacherComponent.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import {RegularButton} from "../../components/RegularButton.tsx";
import { useTranslation } from 'react-i18next';

export function CreateProject(): JSX.Element {
    const emptyProjectTeacher: ProjectTeacher = {
        courseName: "",
        deadline: new Date(Date.now()),
        description: "",
        groupProject: false,
        hours: 22,
        minutes: 58,
        otherFilesAllow: false,
        projectName: "",
        requiredFiles: "",
    };

    const { t } = useTranslation();

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('create_project.title')} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main my-3 is-flex is-flex-direction-column"}>
                    <div className={"mx-5"}>
                        <RegularButton placeholder={t('create_project.save_button')} add={false} onClick={() => {}}/>
                    </div>
                    <ProjectTeacherComponent project={emptyProjectTeacher}/>
                </div>
            </div>
        </>
    )
}
