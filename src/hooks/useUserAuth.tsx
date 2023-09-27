import { useContext } from "react"
import { UserAuthContext } from "./UserAuthContext"

export const useUserAuth = () => {
    return useContext(UserAuthContext)!
}