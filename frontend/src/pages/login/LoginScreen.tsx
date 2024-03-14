import {JSX} from "react";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiFetch from "../../utils/ApiFetch";
import delphi_full from '../../assets/images/delphi_full.png';

export default function LoginScreen(): JSX.Element {
    const location = useLocation();
    const [ticket, setTicket] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        // console.log('hello from', location);
        const params = new URLSearchParams(location.search);
        const ticket = params.get('ticket');
        if (ticket) {
            setTicket(ticket);
        }
    }, [location]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        async function loginUser(ticket: string) {
            await apiFetch(`/api/login?ticket=${ticket}`, {
            // await fetch(`http://127.0.0.1:8000/api/login?ticket=${ticket}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                .then(response => response.json())
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                // .then(data => sessionStorage.setItem('token', data.token));
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
                .then(data => setToken(data.token)); //TODO do something with this token
        }
        if (ticket) {
            console.log('ticket:', ticket);
            void loginUser(ticket).then(r => console.log(r));
        }
    }, [ticket]);

    return (
        <div className="card">
            <div className="card-image">
                <figure className="image is-128x128">
                    <img src={delphi_full} alt="Delphi logo" />
                </figure>
            </div>
            <section className="section">
                <h1 className="title">Welcome to Delphi!</h1>
                <h2 className="subtitle">
                    This page is still work in progress. But if you click <strong>the big green button below </strong>to
                    log in with your UGent account, it will display your token :)
                </h2>
                <a className="button is-primary"
                    // href="https://login.ugent.be/login?service=https://sel2-2.ugent.be/login"
                   href="https://login.ugent.be/login?service=https://localhost:8080/login"
                >Log in</a>
                <div>
                    <input type="text" value={token} readOnly/>
                </div>

                <a className="button is-ghost"
                    // href="https://login.ugent.be/login?service=https://sel2-2.ugent.be/login"
                   href="/student"
                >Take me straight to the student page instead</a>
            </section>
        </div>
    )
}