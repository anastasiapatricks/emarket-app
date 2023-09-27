import { createContext, useMemo } from "react";
import { User } from "../models/User";
import { LoginReq } from "../models/UserReqResp";
import { newUserService } from "../services/UserService";
import useLocalStorage from "./useLocalStorage";

export interface UserAuth {
    user: User | null
    token: string | null
    login(req: LoginReq): Promise<void>
    logout(): void
}

export const UserAuthContext = createContext<UserAuth | null>(null)

export const UserAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useLocalStorage<User | null>('user', null)
    const [token, setToken] = useLocalStorage<string | null>('token', null)

    const userService = useMemo(() => newUserService(), [])

    const userAuth: UserAuth = {
        user,
        token,
        login: async (req: LoginReq) => {
            const resp = await userService.login(req)
            setUser({
                id: resp.id,
                username: resp.username,
                name: resp.name,
                email: resp.email,
                contactNo: resp.contactNo,
                role: resp.role,
                isAdmin: resp.role == 'ADMIN'
            })
            setToken(resp.token)
        },
        logout: () => {
            setUser(null)
            setToken(null)
        }
    }

    return <UserAuthContext.Provider value={userAuth}>
        {children}
    </UserAuthContext.Provider>
}