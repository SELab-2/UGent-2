import {JSX} from "react";


export default function ProjectCardStudent(): JSX.Element {
    // as for now I'm not sure how the info will come in, so using
    // static values for now (change to true and true/false to see how they'll look like):
    let has_submission: boolean = true;
    let isSuccess: boolean = true;

    return (
        <div
            className={"card project-card px-5 py-5 my-5 is-flex is-flex-direction-column is-justify-content-space-between"}>
            <p className={"title is-5"}>Markov Decision Diagram</p>
            <div className={"is-flex is-flex-direction-row"}>
                <p className={"pr-2"}>vak: </p>
                <p>Computationele Biologie</p>
            </div>
            <div className={"is-flex is-flex-direction-row is-align-items-center py-5"}>
                <p className={"pr-2"}>status: </p>
                {!has_submission && <p className={"px-2 py-1"}>—</p>}
                {has_submission && isSuccess &&
                    <div className={"card"}><p className={"p-positive px-2 py-1"}>Success</p></div>}
                {has_submission && !isSuccess &&
                    <div className={"card"}><p className={"p-negative px-2 py-1"}>Failed</p></div>}
            </div>
        </div>
    )
}



