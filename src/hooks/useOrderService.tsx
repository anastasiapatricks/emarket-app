import { AxiosRequestConfig } from "axios"
import { useMemo } from "react"
import { newOrderService } from "../services/OrderService"
import { useUserAuth } from "./useUserAuth"

export const useOrderService = () => {
    const { token } = useUserAuth()

    const config: AxiosRequestConfig = {}
    if (token) {
        config.headers = {
            'Authorization': 'Bearer ' + token
        }
    }

    return useMemo(() => newOrderService(config), [token])
}