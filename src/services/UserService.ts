import axios, { AxiosRequestConfig } from "axios"
import { BaseResp, LoginReq, LoginResp, RegisterReq, RegisterResp, UserResp } from "../models/UserReqResp"
import Config from "../config"

export const newUserService = (config?: AxiosRequestConfig) => {
    const client = axios.create({
        baseURL: Config.ApiBaseUrls.User,
        ...config,
    })

    return {
        register: async (req: RegisterReq) => {
            const resp = await client.post('/api/user/register', req)
            const data = resp.data as BaseResp
            if (data.result != 'Y') {
                throw new Error(`Register failed, result ${data.result}: ${data.message}`)
            }
            const payload = data.payload as RegisterResp
            return payload
        },

        login: async (req: LoginReq) => {
            const resp = await client.post('/api/user/login', req)
            const data = resp.data as BaseResp
            if (data.result != 'Y') {
                throw new Error(`Login failed, result ${data.result}: ${data.message}`)
            }
            const payload = data.payload as LoginResp
            return payload
        },

        getUserById: async (id: number) => {
            const resp = await client.get(`/api/user/retrieve/${id}`)
            return resp.data as UserResp
        },
    }
}