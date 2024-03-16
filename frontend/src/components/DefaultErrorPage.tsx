import {JSX} from "react";
import {BiError} from "react-icons/bi";

export default function DefaultErrorPage(title: string, body: string): JSX.Element {
    return (
        <div id="error-page" className={"container is-max-desktop mt-6"}>
            <article className="message">
                <div className="message-header has-background-danger-dark">
                    <span className="icon-text">
                      <span className="icon">
                        <i><BiError/></i>
                      </span>
                      <span>{title}</span>
                    </span>
                </div>
                <div className="message-body">
                    {body}
                    <br/>
                    <a href={"/"}>Go back to the homepage</a>
                </div>
            </article>
        </div>
    );
}