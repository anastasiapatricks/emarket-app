export interface CartItem {
    cartId: string,
    userId: string,
    productId: string,
    quantity: string,
    createdDate: string,
    updateDate: string,
    status: CartStatusEnum
}

export interface UpdateItemCart {
    cartId: string,
    productId: string,
    quantity: number
}

export interface InputItemCart {
    productId: string,
    quantity: number,

}

export enum CartStatusEnum {
    EMPTY = "Empty",
    ACTIVE = "Active",
    CHECKOUT = "Checkout",
    PAID = "Paid",
    CANCELED = "Canceled",
}
