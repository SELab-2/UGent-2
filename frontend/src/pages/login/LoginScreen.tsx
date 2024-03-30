import {JSX, useEffect, useState} from "react";
import {Navigate, useLocation, useRouteLoaderData} from 'react-router-dom';
import useAuth from "../../hooks/useAuth.ts";
import loginLoader, {LOGIN_ROUTER_ID, loginLoaderObject} from "../../dataloaders/LoginLoader.ts";
import LoginForm from "../../components/authentication/LoginForm.tsx";
import {DEBUG} from "../root.tsx";
import {Token} from "../../utils/ApiInterfaces.ts";
import ErrorLogin from "../../components/authentication/ErrorLogin.tsx";

interface location_type {
    search?: { ticket?: string },
    state?: { from?: { pathname: string } },
    pathname: string
}

const ticketLogin = async (ticket: string, setError: (value: (((prevState: string) => string) | string)) => void) => {
    let url = '/api/login?ticket=' + ticket
    if (DEBUG) {
        url = 'http://127.0.0.1:8000/api/login?ticket=' + ticket
    }

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(async response => {
            if (response.ok) {
                return await response.json() as Token
            }
        })
        .then(data => {
            if (data && data.token) {
                localStorage.setItem('token', data.token)
                return data.token
            } else {
                return undefined
            }
        })
        .catch(error => {
            setError("" + error)
        })
}

export default function LoginScreen(): JSX.Element {
    const {user, setUser} = useAuth();
    const location = useLocation() as location_type;
    const searchParams = new URLSearchParams(useLocation().search);
    const [error, setError] = useState('')
    const ticket = searchParams.get('ticket') || ''
    let next: string = location.state?.from?.pathname || localStorage.getItem("to") || '/'
    // preventing infinite loop
    if (next === '/login') {
        next = '/'
    }
    localStorage.setItem('to', next)

    // Loading the user using the saved token
    const data: loginLoaderObject = useRouteLoaderData(LOGIN_ROUTER_ID) as loginLoaderObject
    useEffect(() => {
        // If the saved token is valid => the user will be logged in
        if (data && data.user) {
            setUser(data.user)
        } else if (!user && ticket) {
            void ticketLogin(ticket, setError).then((token) => {
                if (token) {
                    void loginLoader().then(result => {
                        setUser(result.user)
                    })
                }
            })
        }

    }, [data, setUser, ticket, user]);

    return <div>
        {error !== "" && <ErrorLogin/>}
        {user && <Navigate to={next} replace/>}
        {!user && ticket === "" && <LoginForm/>}
    </div>
}