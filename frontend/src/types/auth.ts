import {User} from "../utils/ApiInterfaces.ts";
import React from "react";

export type AuthContextType = {
    user: User | undefined,
    setUser:React.Dispatch<React.SetStateAction<User | undefined>>
};