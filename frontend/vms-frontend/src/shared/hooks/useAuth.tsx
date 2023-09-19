import { useContext } from "react";
import { AuthContext } from "../contex/auth-context";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;