import {JSX} from "react";
import {BiError} from "react-icons/bi";
import {useTranslation} from 'react-i18next';

export default function DefaultErrorPage(props: {title: string, body: string}): JSX.Element {

    const { t } = useTranslation();

    return (
        <div id="error-page" className={"container is-max-desktop mt-6"}>
            <article className="message">
                <div className="message-header has-background-danger-dark">
                    <span className="icon-text">
                      <span className="icon">
                        <i><BiError/></i>
                      </span>
                      <span>{props.title}</span>
                    </span>
                </div>
                <div className="message-body">
                    {props.body}
                    <br/>
                    <a href={"/"}>{t('unauthorized.back')}</a>
                </div>
            </article>
        </div>
    );
}