import { authMiddleware } from "@clerk/nextjs";


export default authMiddleware({
    publicRoutes: [
        "/api/hooks/clerk",
        "/api/purchase",
        "/purchase",
        "/checkout",
        "/purchase/error",
        "/api/uploader",
        "/"
    ],
    ignoredRoutes: ["/(.*\\..*)(.*)", "/(_next)(.*)"],
})

export const config = {
    mathcher: ["/((?!.*\\..*|_next/static|_next/image|favicon.ico).*)","/","/(api|trpc)(.*)"]
}