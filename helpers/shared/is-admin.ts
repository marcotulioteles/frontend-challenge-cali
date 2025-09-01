export const isAdmin = (roles?: unknown) => {
    return Array.isArray(roles) && roles.includes("admin");
}