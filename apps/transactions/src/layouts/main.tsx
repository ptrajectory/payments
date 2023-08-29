import React, { ReactNode } from 'react'

type MainLayoutProps = {
    children: ReactNode
}

function MainLayout(props: MainLayoutProps) {
    const { children } = props
  return (
    <div className="w-screen h-screen flex flex-col">
        {
            children
        }
    </div>
  )
}

export default MainLayout