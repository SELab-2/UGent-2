import {JSX, useState} from "react";
import {RegularButton} from "./RegularButton.tsx";
import {IoExitOutline} from "react-icons/io5";
import {useTranslation} from "react-i18next";
import {leave_course} from "../utils/api/Student.ts";
import {useNavigate} from "react-router-dom";

export default function LeaveCourseStudent(props: {course_id: number}): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const {t} = useTranslation();
    const navigate = useNavigate();

    const course_leave = async () => {
        try {
            const success = await leave_course(props.course_id);
            if (success) {
                navigate(`/student/`);
            } else {
                alert("There was an error while trying to leave this course, please try again.");
            }
        } catch (error) {
            console.error("Error archiving course:", error);
            alert("There was an error while trying to leave this course, please try again.");
        }
    };

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <>
            <button className="js-modal-trigger button is-danger" onClick={changeModal}>
                <IoExitOutline size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t('popups.leave_course')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            {t('popups.leave_question')}
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={t('popups.yes')} add={false} styling={"is-danger"}
                                       onClick={() => {
                                           void course_leave()
                                       }}/>
                        <RegularButton placeholder={t('popups.no')} add={false} styling={"is-info"}
                                       onClick={changeModal}/>
                    </footer>
                </div>
            </div>
        </>
    )
}
