import {JSX} from 'react';
import {BiError} from "react-icons/bi";

export default function ErrorPage(): JSX.Element {
    const error = useRouteError();

    return (
        <div id="error-page" className={"container is-max-desktop mt-6"}>
            <article className="message">
                <div className="message-header has-background-danger-dark">
                    <span className="icon-text">
                      <span className="icon">
                        <i><BiError/></i>
                      </span>
                      <span>Oops, an unexpected error has occurred!</span>
                    </span>
                </div>
                <div className="message-body">
                    {errorMessage(error)}
                    <br/>
                    <a href={"/"}>Go back to the homepage</a>
                </div>
            </article>
        </div>
    )
        ;
}