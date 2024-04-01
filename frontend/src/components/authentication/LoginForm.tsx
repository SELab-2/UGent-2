import {JSX} from "react";
import delphi_full from "/delphi_full.png";
import {DEBUG} from "../../pages/root.tsx";

export default function LoginForm(): JSX.Element {
    let url = 'https://login.ugent.be/login?service=https://sel2-2.ugent.be/login'
    if (DEBUG){
        url = "https://login.ugent.be/login?service=https://localhost:8080/login"
    }

    return (
        <div className="centered-card">
            <div className="card m-6 p-6 content has-text-centered">
                <img src={delphi_full} alt="Delphi logo"/>
                <h1 className="title width"> Welcome to Delphi!</h1>
                <p className="subtitle">{"To login, please click the button below, " +
                    "you'll get redirected to the login page of UGent CAS."}</p>
                <a className="button is-primary is-large" href={url}>Log in</a>
            </div>
        </div>
    )
        ;
}