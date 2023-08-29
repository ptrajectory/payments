import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ClerkProvider } from "@clerk/nextjs"
import Layout from '@/layouts'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}> 
      <Layout
        pageProps={pageProps}
      >
       <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  )
}
