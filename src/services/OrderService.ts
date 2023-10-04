import axios, { AxiosRequestConfig } from "axios"
import { Order, OrderReq } from "../models/OrderReqResp"

export const newOrderService = (config?: AxiosRequestConfig) => {
    const client = axios.create({
        baseURL: 'http://localhost:8080',
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
        create: async (req: OrderReq) => {
            await client.post('/delivery-order', req)
        },
        update: async (id: number, req: OrderReq) => {
            await client.put(`/delivery-order/${id}`, req)
        },
        delete: async (id: number) => {
            await client.delete(`/delivery-order/${id}`)
        }
    }
}