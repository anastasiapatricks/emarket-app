import { AxiosRequestConfig } from "axios"
import { useMemo } from "react"
import { newProductService } from "../services/ProductService"
import { useUserAuth } from "./useUserAuth"

export const useProductService = () => {
    const { token } = useUserAuth()

    const config: AxiosRequestConfig = {}
    if (token) {
        config.headers = {
            'Authorization': 'Bearer ' + token
        }
    }

    return useMemo(() => newProductService(config), [token])
}