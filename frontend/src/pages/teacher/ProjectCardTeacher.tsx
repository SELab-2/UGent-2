import {useTranslation} from "react-i18next";

export default function ProjectCardTeacher(): JSX.Element {

    const { t } = useTranslation();

    return (
        <div
            className={"card project-card px-5 py-5 my-5 is-flex is-flex-direction-column"}>
            <p className={"title is-5"}>RSA security</p>
            <div className={"card-text is-flex is-flex-direction-row"}>
                <p className={"pr-2"}>{t('home_student.card.tag.course')}</p>
                <p>Information Security</p>
            </div>
        </div>
    )
}