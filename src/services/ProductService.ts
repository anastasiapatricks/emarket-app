import axios, { AxiosRequestConfig } from "axios"
import { Product, ProductParam } from "../models/ProductReqResp"

export const newProductService = (config?: AxiosRequestConfig) => {
    const client = axios.create({
        baseURL: 'http://localhost:9002',
        ...config,
    })

    return {
        get: async (productId: string) => {
            const resp = await client.get(`/api/product/${productId}`)
            return resp.data as Product
        },
        getAll: async () => {
            const resp = await client.get('/api/product')
            return resp.data as Product[]
        },
        create: async (req: ProductParam) => {
            await client.post('/api/product', req)
        },
        update: async (productId: string, req: ProductParam) => {
            await client.put(`/api/product/${productId}`, req)
        },
        delete: async (productId: string) => {
            await client.delete(`/api/product/${productId}`)
        }
    }
}