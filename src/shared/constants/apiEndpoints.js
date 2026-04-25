const API_ENDPOINTS = {
    Auth: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        LOGOUT: "/api/auth/logout",
        REFRESH: "/api/auth/refresh",
        GOOGLE_OAUTH: "/api/auth/google",
        GITHUB_OAUTH: "/api/auth/github",
    },

    User: {
        GET: "/api/user",
        UPDATE: "/api/user/update",
        DELETE: "/api/user/delete",
        FETCH_WATCHLIST: "/api/user/watchList",
        TOGGLE_WATCHLIST: (id) => `/api/user/watchList/${id}`,
    },

    Auction: {
        CREATE: "/api/auction",
        GET_ALL: "/api/auction",
        GET_BY_SELLER: "/api/auction/seller",
        GET_LIVE: "/api/auction/live",
        GET_BY_ID: (id) => `/api/auction/${id}`,
        UPDATE: (id) => `/api/auction/${id}`,
        START: (id) => `/api/auction/${id}/start`,
        END: (id) => `/api/auction/${id}/end`,
    },

    Bid: {
        PLACE: "/api/bid",
        GET_USER_BIDS: "/api/bid",
        GET_BY_ID: (bidId) => `/api/bid/${bidId}`,
        GET_BY_AUCTION: (auctionId) => `/api/bid/auction/${auctionId}`,
        GET_HIGHEST: (auctionId) => `/api/bid/highest/${auctionId}`,
        GET_MY_HIGHEST: (auctionId) => `/api/bid/my-highest/${auctionId}`,
        DELETE: (bidId) => `/api/bid/${bidId}`,
    },

    Order: {
        CREATE: "/api/order",
    },

    Payment: {
        CREATE: "/api/payment",
        GET_MY: "/api/payment/my",
        GET_BY_ORDER: (orderId) => `/api/payment/order/${orderId}`,
        CANCEL: (payId) => `/api/payment/cancel/${payId}`,
        UPDATE_STATUS: (payId) => `/api/payment/status/${payId}`,
        REFUND: (payId) => `/api/payment/refund/${payId}`,
        VERIFY_SIGNATURE: "/api/payment/verify",
    },

    Otp: {
        VERIFY: "/api/otp/verify",
        RESEND: "/api/otp/resend",
    },

    ChatBot: {
        CHAT: "/api/chat/chat",
    },
};

export { API_ENDPOINTS };
