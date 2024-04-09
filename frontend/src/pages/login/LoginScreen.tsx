import React, {JSX, useEffect} from "react";
import {Navigate, useLocation, useRouteLoaderData} from 'react-router-dom';
import useAuth from "../../hooks/useAuth.ts";
import loginLoader, {LOGIN_ROUTER_ID, loginLoaderObject} from "../../dataloaders/LoginLoader.tsx";
import LoginForm from "../../components/authentication/LoginForm.tsx";
import {Token, User} from "../../utils/ApiInterfaces.ts";
import {post_ticket} from "../../utils/api/Login.ts";

interface location_type {
    search?: { ticket?: string },
    state?: { from?: { pathname: string } },
    pathname: string
}

const ticketLogin = async (ticket: string, setUser: React.Dispatch<React.SetStateAction<User | undefined>>) => {
    const token: Token = await post_ticket(ticket)

    if (token.token) {
        localStorage.setItem('token', token.token)
        const result: loginLoaderObject = await loginLoader()
        if (isUser(result.user)) {
            setUser(result.user)
        }else{
            localStorage.removeItem('token')
            setUser(undefined)
        }
    }

    return token;
}

<<<<<<< HEAD
<<<<<<< HEAD
const isUser = (data?: User) => {
    return (data && data.id && data.name && data.email && data.roles);

}

=======
>>>>>>> a25cbf2 (mapping backend_user <> user)
=======
const isUser = (data?: User) => {
    return (data && data.user_id && data.user_name && data.user_email && data.user_roles);
}

>>>>>>> 81deb20 (Functies user, projects, subjects, group, course)
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
            if (isUser(data.user)) {
                setUser(data.user)
            }else{
                setUser(undefined)
                localStorage.removeItem('token')
            }
        } else if (!user && ticket) {
            void ticketLogin(ticket, setUser);
        }
    }, [data, setUser, ticket, user]);

    return <div>
        {user && <Navigate to={next} replace/>}
        {!user && ticket === "" && <LoginForm/>}
    </div>
}