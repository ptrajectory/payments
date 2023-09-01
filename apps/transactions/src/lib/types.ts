
export type tSkeleton = 'dashboard' | 
'dashboard-store-home' | 
'dashboard-store-products' | 
'dashboard-store-customers' | 
'dashboard-store-customers-customer' | 
'dashboard-store-products-product'

export type PageLayoutProps = { 
    layout?: "dashboard" | "main"
    hide_sidebar?: boolean
    skeleton?: tSkeleton
}