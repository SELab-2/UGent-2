import {JSX} from "react";
import {useTranslation} from "react-i18next";
import {Link, useRouteLoaderData} from "react-router-dom";
import {JOIN_COURSE, JoinCourseObject} from "../../dataloaders/JoinCourse.ts";
import {join_course} from "../../utils/api/Student.ts";

export default function JoinCourseScreen(): JSX.Element {

    const {t} = useTranslation();
    const {course_id, course_name, error} = useRouteLoaderData(JOIN_COURSE) as JoinCourseObject;
    if (error) {
        return joinCourseError(error);
    }
    return (
        <div>
            <h1>{`${t('join_course.message')} ${course_name}?`}</h1>
            <a onClick={() => {
                join_course(course_id);
                window.location.replace(`/student/course/${course_id}`)
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