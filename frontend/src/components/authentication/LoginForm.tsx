import {JSX} from "react";
import {DEBUG} from "../../pages/root.tsx";
import {useTranslation} from 'react-i18next';

export default function LoginForm(): JSX.Element {
    let url = 'https://login.ugent.be/login?service=https://sel2-2.ugent.be/login'
    if (DEBUG) {
        url = "https://login.ugent.be/login?service=https://localhost:8080/login"
    }

    const {t} = useTranslation();

    return (
        <div className="card m-6 p-6 content has-text-centered">
            <img src={"/logo.png"} alt="Delphi logo"/>
            <h1 className="title width"> {t('login.title')}</h1>
            <p className="subtitle">{t('login.text')}</p>
            <a className="button is-primary is-large" href={url}>{t('login.button')}</a>
        </div>
    )
}