export interface LoginReq {
    username: string
    password: string
}

export interface LoginResp {
    id: string
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
    id: string
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