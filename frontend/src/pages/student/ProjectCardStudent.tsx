import {JSX} from "react";


export default function ProjectCardStudent(): JSX.Element {
    // TODO: {{
    //      hasSubmission: check if there is a submission found in the database, if not it must return '-' on the screen
    //      isSuccess: when there is a submission, it must return either 'success' or 'failed'
    //      => if hasSubmission is false, isSuccess won't be checked (so ignoring all value changes)
    //      => when this isn't prefetched, useState will be needed for hasSubmission to rerender status correctly
    //  }}
    const hasSubmission: boolean = false;
    const isSuccess: boolean = true;

    return (
        <div
            className={"card project-card px-5 py-5 my-5 is-flex is-flex-direction-column is-justify-content-space-between"}>
            <p className={"title is-5"}>Markov Decision Diagram</p>
            <div className={"card-text is-flex is-flex-direction-row"}>
                <p className={"pr-2"}>vak: </p>
                <p>Computationele Biologie</p>
            </div>
            <div className={"is-flex is-flex-direction-row is-align-items-center py-5"}>
                <p className={"pr-2"}>status: </p>
                {!hasSubmission && <p className={"px-2 py-1"}>—</p>}
                {hasSubmission && isSuccess &&
                    <div className={"card"}><p className={"p-positive px-2 py-1"}>Success</p></div>}
                {hasSubmission && !isSuccess &&
                    <div className={"card"}><p className={"p-negative px-2 py-1"}>Failed</p></div>}
            </div>
        </div>
    )
}



