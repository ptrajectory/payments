import { authMiddleware } from "@clerk/nextjs";


export default authMiddleware({
    ignoredRoutes: [
        "/api/hooks/clerk"
    ]
})

export const config = {
    mathcher: [
        "/((?!.*\\..*|_next).*)", 
        "/", 
        "/(api|trpc)(.*)"
    ]
}