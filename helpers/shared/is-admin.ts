export const isAdmin = (roles?: unknown) => {
    console.log("[LOG] isAdmin called with roles: ", { roles });
    return Array.isArray(roles) && roles.includes("admin");
}