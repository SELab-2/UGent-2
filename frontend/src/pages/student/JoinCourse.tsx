import {JSX} from "react";
import {useTranslation} from "react-i18next";
import {Link, useRouteLoaderData} from "react-router-dom";
import ApiFetch from "../../utils/ApiFetch.ts";
import {JOIN_COURSE, JoinCourseObject} from "../../dataloaders/JoinCourse.ts";

export default function JoinCourseScreen(): JSX.Element {

    const {t} = useTranslation();
    const data = useRouteLoaderData(JOIN_COURSE) as JoinCourseObject;
    if (data.error) {
        return joinCourseError(data.error);
    }
    return (

        <div>
            <h1>{`${t('join_course.message')} ${data.course_name}?`}</h1>
            <a onClick={() => {
                joinCourse(data.course_id);
                window.location.replace(`/student/course/${data.course_id}`)
            }}>{t('join_course.join')}</a>
            <Link to={"/student"}>{t('join_course.return_home')}</Link>
        </div>
    )
}

function joinCourseError(error: string): JSX.Element {
    // TODO: Implement this
    return (
        <div>
            <h1>{error}</h1>
        </div>
    )
}

function joinCourse(course_id: number) {
    // Do something
    void ApiFetch<void>(`/student/courses/${course_id}/join`, {method: 'POST'});
}