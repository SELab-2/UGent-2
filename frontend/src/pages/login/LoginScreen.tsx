import {JSX, useEffect, useState} from "react";
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import delphi_full from '../../assets/images/delphi_full.png';
import userResponse from "../../api_responses/IUser.ts";
import tokenResponse from "../../api_responses/IToken.ts";
import useAuth from "../../hooks/useAuth.ts";

interface location_type {
    search?: { ticket?: string },
    state?: { from?: { pathname: string } }
}

export default function LoginScreen(): JSX.Element {
    const {isAuthenticated, login} = useAuth();
    const location = useLocation() as location_type;

    let from = "/"
    if (location.state?.from?.pathname) {
        from = location.state.from.pathname
    }
    console.log(from)
    const navigate = useNavigate();
    const [ticket, setTicket] = useState('');
    const [token, setToken] = useState<string | undefined>('')

    useEffect(() => {
        // console.log('hello from', location);
        const params = new URLSearchParams(location.search);
        const ticket = params.get('ticket');
        if (ticket) {
            setTicket(ticket);
        }
    }, [location]);

    useEffect(() => {
        async function loginUser() {
            //await apiFetch(`/api/login?ticket=${ticket}`, {
            await fetch(`http://127.0.0.1:8000/api/login?ticket=${ticket}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(async response => (await response.json() as tokenResponse))
                .then(data => setToken(data.token))
        }

        if (ticket) {
            void loginUser()
        }

    }, [ticket]);

    useEffect(() => {
        async function retrieveUser() {
            //await fetch(`/api/login?ticket=${ticket}`, {

            await fetch(`http://127.0.0.1:8000/api/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'cas': "" + token
                },
            })
                .then(async response => (await response.json()) as userResponse)
                .then(user => {
                    login({id: user.id, name: user.name, email: user.email, roles: user.roles}, token)
                })
        }

        if (token) {
            void retrieveUser()
        }
    }, [from, login, navigate, token]);

    return (
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
            {isAuthenticated && <Navigate to={from}/>}
        </div>
    )
}