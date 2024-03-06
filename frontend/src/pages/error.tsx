import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import {JSX} from 'react';

export default function ErrorPage(): JSX.Element {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{errorMessage(error)}</i>
            </p>
        </div>
    );
}

interface RouterError extends Error {}

function isRouterError(object: unknown): object is RouterError {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return 'message' in object;
}

function errorMessage(error: unknown): string {
    if (isRouteErrorResponse(error)) {
        return `${error.status} ${error.statusText}`
    } else if (error != undefined && isRouterError(error)) {
        return error.message;
    } else if (typeof error === 'string') {
        return error
    } else {
        console.error(error)
        return 'Unknown error'
    }
}