import axios, {AxiosRequestConfig} from "axios"
import {InputItemCart, CartItem, UpdateItemCart} from "../models/CartReqResp.ts"
import Config from "../config"

export const cartService = (config?: AxiosRequestConfig) => {
    const client = axios.create({
        baseURL: Config.ApiBaseUrls.Cart,
        ...config,
    })

    return {
        createNewCart: async (user_id: string, input_cart_item: InputItemCart) => {
            const resp = await client.post(`/cart/${user_id}`, input_cart_item)
            return resp.data as CartItem
        },
        getCartById: async (user_id: string, cart_id: string) => {
            const resp = await client.get(`/cart/${user_id}/${cart_id}`)
            return resp.data as CartItem
        },

        updateCart: async (user_id: string, updateCart: UpdateItemCart[]) => {
            const resp = await client.put(`/cart/${user_id}`, updateCart)
            return resp.data as CartItem[];
        },

        getUserCart: async (user_id: string) => {
            const resp = await client.get(`/cart/${user_id}`)
            return resp.data as CartItem[]
        },

        deleteCartById: async (user_id: string, cart_id: string) => {
            await client.delete(`/cart/${user_id}/${cart_id}`)
            return true
        }
        // get: async (id: number) => {
        //     const resp = await client.get(`/delivery-order/${id}`)
        //     return resp.data as Order
        // },
        // getAll: async () => {
        //     const resp = await client.get('/delivery-order')
        //     return resp.data as Order[]
        // },
        // getAllByUserId: async (userId: number) => {
        //     const resp = await client.get(`/delivery-order/history/${userId}`)
        //     return resp.data as Order[]
        // },
        // updateStatus: async (id: number, status: string) => {
        //     const resp = await client.post(`/delivery-order/update-status/${id}`, status, {
        //         headers: {
        //             'Content-Type': 'text/plain',
        //         },
        //     })
        //     return resp.data as Order
        // },
        // create: async (req: OrderReq) => {
        //     await client.post('/delivery-order/add', req)
        // },
        // update: async (id: number, req: OrderReq) => {
        //     await client.post(`/delivery-order/edit/${id}`, req)
        // },
        // delete: async (id: number) => {
        //     await client.delete(`/delivery-order/${id}`)
        // }
    }
}