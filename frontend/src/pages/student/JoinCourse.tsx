import {JSX} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import ApiFetch from "../../utils/ApiFetch.ts";

export default function JoinCourseScreen(): JSX.Element {

    const course_id = 1;
    const course_name = "Course 1";
    const {t} = useTranslation();
    return (

        <div>
            <h1>{`${t('join_course.message')} ${course_name}?`}</h1>
            <a onClick={() => joinCourse(course_id)}>{t('join_course.join')}</a>
            <Link to={"/student"}>{t('join_course.return_home')}</Link>
        </div>
    )
}

function joinCourse(course_id: number) {
    // Do something
    console.log(course_id)
    void ApiFetch<void>(`/student/course/${course_id}/join`, {method: 'POST'});
    window.location.href.replace(/\/join$/, '')
}