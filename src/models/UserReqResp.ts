export interface LoginReq {
    username: string
    password: string
}

export interface LoginResp {
    id: number
    username: string
    name: string
    email: string
    contactNo: string
    role: string
    token: string
}

export interface RegisterReq {
    username: string
    name: string
    email: string
    contactNo: string
    role: string
    password: string
}

export interface RegisterResp {
    id: number
    username: string
    name: string
    email: string
    contactNo: string
    createdDateTime: Date
    role: string
    password: string
}

export interface UserResp {
    id: number
    username: string
    name: string
    email: string
    contactNo: string
    createdDateTime: Date
    role: string
    password: string
}

export interface BaseResp {
    message: string
    payload: unknown
    result: string
}