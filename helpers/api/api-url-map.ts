export const API_URL_MAP = {
    users: {
        profile: "/api/users/profile",
        me: {
            roles: "/api/users/me/roles",
        }
    },
    auth: {
        session: "/api/auth/session",
        logout: "/api/auth/logout",
    },
    transactions: {
        create: "/api/transactions",
        list: "/api/transactions",
    },
};
