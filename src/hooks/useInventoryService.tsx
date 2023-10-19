import { AxiosRequestConfig } from "axios"
import { useMemo } from "react"
import { newInventoryService } from "../services/InventoryService"
import { useUserAuth } from "./useUserAuth"

export const useInventoryService = () => {
    const { token } = useUserAuth()

    return useMemo(() => {
        const config: AxiosRequestConfig = {}
        if (token) {
            config.headers = {
                'Authorization': 'Bearer ' + token
            }
        }
        return newInventoryService(config)
    }, [token])
}