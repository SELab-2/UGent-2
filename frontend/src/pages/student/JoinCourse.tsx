import {JSX} from "react";
import {useTranslation} from "react-i18next";
import {Link, useRouteLoaderData} from "react-router-dom";
import {join_course} from "../../utils/api/Student.ts";
import {JOIN_COURSE, JoinCourseObject} from "../../dataloaders/JoinCourse.ts";
import {BiError} from "react-icons/bi";

export default function JoinCourseScreen(): JSX.Element {
    const {t} = useTranslation();
    const {course_id, course_name, error} = useRouteLoaderData(JOIN_COURSE) as JoinCourseObject;

    if (error) {
        return joinCourseError(error);
    }

    return (
        <div className={"join-course card has-text-centered"}>
            <div className={"card p-6"}>
                <p className={"title p-6"}>{`${t('join_course.message')} ${course_name}?`}</p>
                <div className={"is-flex is-justify-content-space-evenly p-6"}>
                    <a className={"button"} onClick={() => {
                        join_course(course_id);
                    }}>{t('join_course.join')}</a>
                    <Link className={"button"} to={"/student"}>{t('join_course.return_home')}</Link>
                </div>
            </div>
        </div>
    )
}

function joinCourseError(error: string): JSX.Element {
    return (
        <div id="error-page" className={"container is-max-desktop mt-6"}>
            <article className="message">
                <div className="message-header has-background-danger-dark">
                    <span className="icon-text">
                      <span className="icon">
                        <i><BiError/></i>
                      </span>
                      <span>Could not join the course, an error occurred.</span>
                    </span>
                </div>
                <div className="message-body">
                    {error}
                    <br/>
                    <a href={"/"}>Go back to the homepage</a>
                </div>
            </article>
        </div>
    )
}