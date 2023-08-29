import { PageLayoutProps } from '@/lib/types'
import React, { ReactNode } from 'react'
import DashboardLayout from './dashboard'
import MainLayout from './main'

interface LayoutProps {
    pageProps: PageLayoutProps
    children: ReactNode
}

function Layout( props: LayoutProps ) {
    const { pageProps, children } = props
  return (
    <>
        {
            pageProps.layout === "dashboard" ?
            (
                <DashboardLayout pageProps={pageProps} >
                    {children}
                </DashboardLayout>
            ) :
            <MainLayout>
                {
                    children
                }
            </MainLayout>
        }
    </>
  )
}

export default Layout