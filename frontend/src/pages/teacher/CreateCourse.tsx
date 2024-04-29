import {JSX, useState} from "react";
import Inputfield from "../../components/Inputfield.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {RegularButton} from "../../components/RegularButton.tsx";
import {useTranslation} from 'react-i18next';
import {createCourse} from "../../utils/api/Teacher.ts";
import {useNavigate} from "react-router-dom";

export default function CreateCourse(): JSX.Element {
    const [courseName, setCourseName] = useState<string>("");

    const {t} = useTranslation();

    const navigate = useNavigate();

    const createCourse_local = async () => {
        try {
            const course = await createCourse(courseName);
            navigate(`/teacher/course/${course.course_id}`);
        } catch (error) {
            console.error("Error creating course:", error);
            alert("There was an error making the course, please try again.");
        }
    };

    const handleButtonClick = () => {
        void createCourse_local();
    };

    return (
        <>
            <div className={"main-header"}>
                <Header page_title={t('create_course.title')} home={"teacher"}/>
            </div>
            <div className={"main-content is-flex is-flex-direction-row"}>
                <div className={"side-bar is-flex is-justify-content-center"}>
                    <Sidebar home={"teacher"}/>
                </div>
                <div className={"student-main my-5"}>
                    <div className={"field is-horizontal"}>
                        <div className={"field-label"}>
                            <label className="label">{t('create_course.name.tag')}</label>
                        </div>
                        <div className="field-body field">
                            <Inputfield placeholder={t('create_course.name.placeholder')} value={courseName}
                                        setValue={setCourseName}/>
                        </div>
                    </div>
                    <div className={"is-flex is-justify-content-center"}>
                        {/*Waiting for the post requests to implement the on click*/}
                        <RegularButton placeholder={t('create_course.confirm')} add={false}
                                       onClick={handleButtonClick}/>
                    </div>
                </div>
            </div>
        </>
    )
}