import React, {JSX, useEffect} from "react";
import {Navigate, useLocation, useRouteLoaderData} from 'react-router-dom';
import useAuth from "../../hooks/useAuth.ts";
import loginLoader, {LOGIN_ROUTER_ID, loginLoaderObject} from "../../dataloaders/LoginLoader.ts";
import LoginForm from "../../components/authentication/LoginForm.tsx";
import {DEBUG} from "../root.tsx";
import {Token, User} from "../../utils/ApiInterfaces.ts";

interface location_type {
    search?: { ticket?: string },
    state?: { from?: { pathname: string } },
    pathname: string
}

const ticketLogin = async (ticket: string, setUser: React.Dispatch<React.SetStateAction<User | undefined>>) => {
    let url = '/api/login?ticket=' + ticket
    if (DEBUG) {
        url = 'http://127.0.0.1:8000/api/login?ticket=' + ticket
    }
    const token = await (await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}}))
        .json() as Token

    if (token.token) {
        localStorage.setItem('token', token.token)
        const result: loginLoaderObject = await loginLoader()
        if (result.user) {
            setUser(result.user)
        }else{
            localStorage.removeItem('token')
            setUser(undefined)
        }
    }

    return token;
}

export default function LoginScreen(): JSX.Element {
    const {user, setUser} = useAuth();
    const location = useLocation() as location_type;
    const searchParams = new URLSearchParams(useLocation().search);
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
        }
        else if (!user && ticket) {
            void ticketLogin(ticket, setUser);
        }
    }, [data, setUser, ticket, user]);

    return <div>
        {user && <Navigate to={next} replace/>}
        {!user && ticket === "" && <LoginForm/>}
    </div>
}