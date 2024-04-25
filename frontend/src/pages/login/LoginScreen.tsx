import React, {JSX, useEffect} from "react";
import {Navigate, useLocation, useRouteLoaderData} from 'react-router-dom';
import useAuth from "../../hooks/useAuth.ts";
import loginLoader, {LOGIN_ROUTER_ID, loginLoaderObject} from "../../dataloaders/LoginLoader.ts";
import LoginForm from "../../components/authentication/LoginForm.tsx";
import {Token, User} from "../../utils/ApiInterfaces.ts";
import {post_ticket} from "../../utils/api/Login.ts";

interface location_type {
    search?: { ticket?: string },
    state?: { from?: { pathname: string } },
    pathname: string
}

async function ticketLogin (ticket: string, setUser: React.Dispatch<React.SetStateAction<User | undefined>>) {
    const token: Token | undefined = await post_ticket(ticket)
    if (token?.token) {
        localStorage.setItem('token', token.token)
        const result: loginLoaderObject = await loginLoader()
        if (result.user) {
            setUser(result.user)
        } else {
            localStorage.removeItem('token')
            setUser(undefined)
        }
    }
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
        } else if (!user && ticket) {
            try {
                void ticketLogin(ticket, setUser);
            } catch (error) {
                console.log("Ticket wasn't accepted")
            }
        }
    }, [data, setUser, ticket, user]);

    return (
        <div className={"login-screen is-flex is-justify-content-center is-align-items-center"}>
            {user && <Navigate to={next} replace/>}
            {!user && ticket === "" && <LoginForm/>}
        </div>
    )
}