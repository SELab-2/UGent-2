import {JSX} from "react";
import {Navigate, useLocation} from 'react-router-dom';
import delphi_full from '../../assets/images/delphi_full.png';
import useAuth from "../../hooks/useAuth.ts";

interface location_type {
    search?: { ticket?: string },
    state?: { from?: { pathname: string } },
    pathname: string
}

export default function LoginScreen(): JSX.Element {
    const location = useLocation() as location_type;
    const params = new URLSearchParams(location.search);

    const next: string = location.state?.from?.pathname || localStorage.getItem("to") || '/'
    const ticket = params.get('ticket');
    const {ticketLogin, user, login, loading} = useAuth();

    localStorage.setItem('to', next)
    if (!loading && localStorage.getItem('token')) {
        login()
    } else if (!loading && !user && ticket) {
        localStorage.setItem('to', next)
        ticketLogin(ticket)
    }

    return <div>
        {loading && <h1>You will be redirected soon, please wait.</h1>}
        {(!loading && user) &&
            <div><Navigate to={next}/></div>}
        {(!user && !loading) &&
            <div className="card">
                <div className="card-image">
                    <figure className="image is-128x128">
                        <img src={delphi_full} alt="Delphi logo"/>
                    </figure>
                </div>
                <section className="section">
                    <h1 className="title">Welcome to Delphi!</h1>
                    <h2 className="subtitle">
                        This page is still work in progress. But if you click <strong>the big green button
                        below </strong>to
                        log in with your UGent account, it will display your token :)
                    </h2>
                    <a className="button is-primary"
                        // href="https://login.ugent.be/login?service=https://sel2-2.ugent.be/login"
                       href="https://login.ugent.be/login?service=https://localhost:8080/login"
                    >Log in</a>

                    <a className="button is-ghost"
                        // href="https://login.ugent.be/login?service=https://sel2-2.ugent.be/login"
                       href="/student"
                    >Take me straight to the student page instead</a>
                </section>
            </div>
        }
    </div>
}