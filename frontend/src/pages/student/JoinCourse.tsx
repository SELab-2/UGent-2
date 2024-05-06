import {JSX} from "react";
import {useTranslation} from "react-i18next";
import {Link, useRouteLoaderData} from "react-router-dom";
import {join_course} from "../../utils/api/Student.ts";
import {JOIN_COURSE, JoinCourseObject} from "../../dataloaders/JoinCourse.ts";

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
                        window.location.replace(`/student/course/${course_id}`)
                    }}>{t('join_course.join')}</a>
                    <Link className={"button"} to={"/student"}>{t('join_course.return_home')}</Link>
                </div>
            </div>
        </div>
    )
}

function joinCourseError(error: string): JSX.Element {
    // TODO: Implement this: redirect?
    return (
        <div>
            <h1>{error}</h1>
        </div>
    )
}