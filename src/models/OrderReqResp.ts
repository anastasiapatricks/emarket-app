export interface Order {
    id: number
    items: Item[]
    totalPrice: number
    userId: number
    address: string
    createdTimestamp: number
    date: Date
    timeslot: string
    deliveryStatus: string
}

export interface GetAllOrderResp {
    id: number
    items: Item[]
    totalPrice: number
    userId: number
    address: string
    createdTimestamp: number
    date: Date
    timeslot: string
    deliveryStatus: string
}

export interface OrderReq {
    id: number
    items: Item[]
    totalPrice: number
    userId: number
    address: string
    createdTimestamp: number
    date: Date
    timeslot: string
    deliveryStatus: string
}

export interface Item {
    productId: string
    name: string
    description: string
    quantity: number
    price: number
}
