import { createContext } from "react";

interface tokenInt {
    refresh: string,
    access: string,
}

export const AuthContext = createContext({
    isLoggedIn: false,
    role: "default",
    username: "",
    tokens: {
        refresh: '',
        access: ''
    },
    defineRole: (userRole: string) => { userRole },
    assignUsername: (username: string) => { username },
    assignToken: (tokens: tokenInt) => { tokens },
    login: () => { },
    logout: () => { },
    updateToken: (refreshToken: string) => { refreshToken }
});