import { createContext } from "react";

interface tokenInt {
    refresh: string,
    access: string,
}
// defining auth context for storing data of logged in user on the scope of the whole app and providing functions to login and logout
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