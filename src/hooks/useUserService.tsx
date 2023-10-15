import { AxiosRequestConfig } from "axios"
import { useMemo } from "react"
import { useUserAuth } from "./useUserAuth"
import { newUserService } from "../services/UserService"

export const useUserService = () => {
    const { token } = useUserAuth()

    return useMemo(() => {
        const config: AxiosRequestConfig = {}
        if (token) {
            config.headers = {
                'Authorization': 'Bearer ' + token
            }
        }
        return newUserService(config)
    } , [token])
}