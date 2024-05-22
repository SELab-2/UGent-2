import {JSX} from "react";
import { useTranslation } from 'react-i18next';

export default function ErrorLogin(): JSX.Element {

    const { t } = useTranslation();

    return (
        <div className="centered-card">
            <div className="card m-6 p-6 content has-text-centered">
                <img src={"/delphi_full.png"} alt="Delphi logo"/>
                <h1 className="title width">{t('login_error.title')}</h1>
                <p className="subtitle">{t('login_error.text')}</p>
                <button className={"button is-primary"} onClick={() => window.location.reload()}>
                    {t('login_error.button')}
                </button>
            </div>
        </div>
    )
}