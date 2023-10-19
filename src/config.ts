const API_GATEWAY = import.meta.env.VITE_API_GATEWAY

const Config = {
    ApiBaseUrls: {
        User: API_GATEWAY ? `https://${API_GATEWAY}/user-service` : 'http://localhost:9001',
        Product: API_GATEWAY ? `https://${API_GATEWAY}/product-service` : 'http://localhost:9002',
        Cart: API_GATEWAY ? `https://${API_GATEWAY}/cart-service` : 'http://localhost:9003',
        Order: API_GATEWAY ? `https://${API_GATEWAY}/order-service` : 'http://localhost:9004',
        Inventory: API_GATEWAY ? `https://${API_GATEWAY}/inventory-service` :'http://localhost:8080',
    }
}

export default Config