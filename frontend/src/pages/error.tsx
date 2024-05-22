import {isRouteErrorResponse, useRouteError} from "react-router-dom";
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

interface RouterError extends Error {
}

function isRouterError(object: unknown): object is RouterError {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return 'message' in object;
}

function errorMessage(error: unknown): string {
    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return "404: The page you are looking for does not exist."
        } else {
            return `${error.status} ${error.statusText}`
        }
    } else if (error != undefined && isRouterError(error)) {
        return error.message;
    } else if (typeof error === 'string') {
        return error
    } else {
        console.error(error) //TODO remove
        return 'Unknown error'
    }
}