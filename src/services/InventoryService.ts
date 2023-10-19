import axios, { AxiosRequestConfig } from "axios"
import Config from "../config"
import { Inventory, InventoryResponse } from "../models/InventoryReqResp"

export const newInventoryService = (config?: AxiosRequestConfig) => {
    const client = axios.create({
        baseURL: Config.ApiBaseUrls.Inventory,
        ...config,
    })

    return {
        get: async (productId: string) => {
            const resp = await client.get(`/api/inventory/${productId}`)
            return resp.data as Boolean
        },
        getAll: async () => {
            const resp = await client.get('/api/inventory')
            return resp.data as InventoryResponse[]
        },
        addInventory: async (req: Inventory[]) => {
            await client.post('/api/inventory/add-inventory', req)
        },
        subtractInventory: async (req: Inventory[]) => {
            await client.post('/api/inventory/subtract-inventory', req)
        },
    }
}