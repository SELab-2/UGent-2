import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {ProjectTeacherComponent} from "../../components/ProjectTeacherComponent.tsx";
import {ProjectTeacher} from "../../types/project.ts";
import Statistics from "../../components/Statistics.tsx";
import {RegularButton} from "../../components/RegularButton.tsx";
import { useTranslation } from 'react-i18next';

export default function ProjectViewTeacher() {

    const { t } = useTranslation();

    const project: ProjectTeacher = {
        projectName: "RSA security",
        courseName: "Information Security",
        hours: 23,
        minutes: 59,
        deadline: new Date('2024-03-23'),
        description: "description of the project",
        requiredFiles: 'Diagram.dgr,verslag.pdf',
        otherFilesAllow: true,
        groupProject: true,
    }

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={project.projectName} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main my-3 is-flex is-flex-direction-column"}>
                    <div className={"mx-5 mb-5 is-flex is-justify-content-start"}>
                        <RegularButton placeholder={t('project.save')} add={false} onClick={() => {}}/>
                        <div className={"mr-5"}/>
                        <Statistics/>
                    </div>
                    <ProjectTeacherComponent project={project}/>
                </div>
            </div>
        </>
    )
}