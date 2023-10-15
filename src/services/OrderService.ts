import axios, { AxiosRequestConfig } from "axios"
import { Order, OrderReq } from "../models/OrderReqResp"
import Config from "../config"

export const newOrderService = (config?: AxiosRequestConfig) => {
    const client = axios.create({
        baseURL: Config.ApiBaseUrls.Order,
        ...config,
    })

    return {
        get: async (id: number) => {
            const resp = await client.get(`/delivery-order/${id}`)
            return resp.data as Order
        },
        getAll: async () => {
            const resp = await client.get('/delivery-order')
            return resp.data as Order[]
        },
        getAllByUserId: async (userId: number) => {
            const resp = await client.get(`/delivery-order/history/${userId}`)
            return resp.data as Order[]
        },
        updateStatus: async (id: number, status: string) => {
            const resp = await client.post(`/delivery-order/update-status/${id}`, status, {
                headers: {
                    'Content-Type': 'text/plain',
                  },
            })
            return resp.data as Order
        },
        create: async (req: OrderReq) => {
            await client.post('/delivery-order/add', req)
        },
        update: async (id: number, req: OrderReq) => {
            await client.post(`/delivery-order/edit/${id}`, req)
        },
        delete: async (id: number) => {
            await client.delete(`/delivery-order/${id}`)
        }
    }
}