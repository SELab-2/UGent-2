import {JSX} from "react";
import delphi_full from "../../../public/delphi_full.png";

export default function ErrorLogin(): JSX.Element {

    return (
        <div className="centered-card">
            <div className="card m-6 p-6 content has-text-centered">
                <img src={delphi_full} alt="Delphi logo"/>
                <h1 className="title width">There was an error logging in!</h1>
                <p className="subtitle">{"To retry, please press the button below"}</p>
                <button className={"button is-primary"} onClick={() => window.location.reload()}>Retry</button>
            </div>
        </div>
    )
        ;

}