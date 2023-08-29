import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { cloneElement } from 'react'

type Props = {
  icon: LucideIcon
  path: string
  children: string
}

function DashboardSideBarButton(props: Props) {
  const { path, children } = props

  const { pathname, query } = useRouter()

  console.log(pathname, query)

  const active = pathname?.replace("[store_id]", query?.store_id as string) === path

  return (
    <Link
      href={path}
      legacyBehavior
    >
      <div className={`flex flex-row items-center justify-start space-x-3 group rounded-md overflow-hidden cursor-pointer hover:bg-gray-200 w-full px-3 py-2 ${active ? "bg-gray-200" : ""}`}>
          <props.icon 
              className={`text-sm  group-hover:text-black ${active ? "text-black": "text-gray-400"} `} 
          />
          <span className={`text-sm font-medium group-hover:text-black ${active ? "text-black" : "text-gray-400"}`}>
              {children}
          </span>
      </div>
    </Link>
  )
}

export default DashboardSideBarButton