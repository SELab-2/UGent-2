import React, {ReactNode, useState} from "react";
import {AuthContext} from "../../context/AuthContext.ts";
import {Token, User} from "../../utils/ApiInterfaces.ts";
import apiFetch from "../../utils/ApiFetch.ts";
import {DEBUG} from "../../pages/root.tsx";

interface Props {
    children?: ReactNode
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}: Props) => {
    const [user, setUser] = useState<User | undefined>({id: -1, name: "", email: "", roles: []})
    const [loading, setLoading] = useState(false)

    /*
        This function will use the given ticket to get a token from CAS and store it in local storage
     */
    function ticketLogin(ticket: string) {
        //await apiFetch(`/api/login?ticket=${ticket}`, {
        setLoading(true)
        let url = '/api/login?ticket='+ticket
        if (DEBUG){
            url = 'http://127.0.0.1:8000/api/login?ticket='+ticket
        }
        void fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async response => (await response.json() as Token))
            .then(async data => {
                if (data.token) {
                    localStorage.setItem('token', data.token)
                    await apiFetch('/api/user')
                        .then(async response => (await response.json() as User))
                        .then(user => {
                            setUser(user)
                        })
                        .finally(() => setLoading(false))
                }
            })
            .finally(() => setLoading(false))
    }

    /*
        This function will login using with the token in local storage
     */
    function login() {
        setLoading(true)
        void apiFetch('/api/user')
            .then(async response => await response.json() as User)
            .then(user => setUser(user))
            .finally(() => setLoading(false))
    }

    const logout = () => {
        setUser(undefined)
        localStorage.removeItem("token")
    }

    return (
        <AuthContext.Provider value={{login, ticketLogin: ticketLogin, logout, user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;