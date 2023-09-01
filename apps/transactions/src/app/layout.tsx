import { ClerkProvider } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

import './globals.css'
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
            </body>
        </html>
    </ClerkProvider>
  )
}

export default RootLayout