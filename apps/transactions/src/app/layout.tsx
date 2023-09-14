import { ClerkProvider } from '@clerk/nextjs'
import React, { ReactNode } from 'react'
import './globals.css'
import { Toaster } from '@/components/atoms/toaster'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: "ptrajectory-payments",
    description: "An open source sdk for mobile money payment intergrations.",
    keywords: [
        "SDK",
        "Mobile Money",
        "typescript",
    ],
    authors: [
        {
            name: "Donald Onyino",
            url: "https://github.com/porkytheblack"
        }
    ],
    creator: "don",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://ptrajectory-payments.iamonyino.com",
        description: "An open source sdk for mobile money payment intergrations.",
        siteName: "Ptrajectory Payments"
    },
    twitter: {
        card: "summary",
        title: "Ptrajectory Payments",
        description: "An open source sdk for mobile money payment intergrations.",
        creator: "@iamonyino"
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.png",
        apple: "/favicon.png"
    }
}

interface RootLayoutProps {
    children: ReactNode
}

function RootLayout(props: RootLayoutProps) {
    const { children } = props 
  return (
    <ClerkProvider>
        <html lang="en" >
            <body>
                {children}
                <Toaster/>
            </body>
        </html>
    </ClerkProvider>
  )
}

export default RootLayout