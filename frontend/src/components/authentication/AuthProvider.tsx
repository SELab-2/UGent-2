import React, {ReactNode, useState} from "react";
import {AuthContext} from "../../context/AuthContext.ts";
import {User} from "../../utils/ApiInterfaces.ts";

interface Props {
    children?: ReactNode
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}: Props) => {
    const [user, setUser] = useState<User | undefined>(undefined)

    return (
        <div>
            {<AuthContext.Provider value={{user, setUser}}>
                {children}
            </AuthContext.Provider>}
        </div>
    )
}

export default AuthContext;