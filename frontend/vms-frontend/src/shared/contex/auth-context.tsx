import { createContext } from "react";

interface tokenInt {
    refresh: string,
    access: string,
}

export const AuthContext = createContext({
    isLoggedIn: false,
    role: "default",
    username: "",
    id: "",
    tokens: {
        refresh: '',
        access: ''
    },
    defineRole: (userRole: string) => { userRole },
    setUserId: (userId: string) => { userId },
    assignUsername: (username: string) => { username },
    assignToken: (tokens: tokenInt) => { tokens },
    login: () => { },
    logout: () => { },
    updateToken: (refreshToken: string) => { refreshToken }
});