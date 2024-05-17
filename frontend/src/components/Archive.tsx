import {JSX, useState} from "react";
import {RegularButton} from "./RegularButton.tsx";
import {FaArchive} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {update_course} from "../utils/api/Course.ts";
import {CourseInput} from "../utils/InputInterfaces.ts";

export default function Archive(props: { course_id: number, course_name: string }): JSX.Element {
    const [modalActive, setModalActive] = useState(false);

    const {t} = useTranslation();
    const navigate = useNavigate();

    const archive_course = async () => {
        try {
            const course_input: CourseInput = {
                name: props.course_name,
                archived: true
            }
            await update_course(props.course_id, course_input);
            navigate(`/`);
        } catch (error) {
            console.error("Error archiving course:", error);
            alert("There was an error archiving the course, please try again.");
        }
    };

    const handle_archive = () => {
        void archive_course();
    };

    const changeModal = () => {
        setModalActive(!modalActive);
    };

    return (
        <>
            <button className="js-modal-trigger button is-rounded is-pulled-right" onClick={changeModal}>
                <FaArchive size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t('popups.archive')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            {t('popups.archive_warning')}
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <RegularButton placeholder={t('popups.yes')} add={false} styling={"is-danger"}
                                       onClick={handle_archive}/>
                        <RegularButton placeholder={t('popups.no')} add={false} styling={"is-info"}
                                       onClick={changeModal}/>
                    </footer>
                </div>
            </div>
        </>
    )
}
