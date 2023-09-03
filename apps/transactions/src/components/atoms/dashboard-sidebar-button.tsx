"use client"
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { cloneElement } from 'react'

type Props = {
  icon: LucideIcon
  path: string
  children: string
  loading?: boolean
}

const matcher = /(customers|products|payments|payment_methods)\/.*/

function DashboardSideBarButton(props: Props) {
  const { path, children, loading } = props

  const pathname = usePathname()
  const query = useParams()

  const active = pathname?.replace("[store_id]", query?.store_id as string)?.replace(matcher, "$1") === path

  return (
    <Link
      href={path}
      legacyBehavior
    >
      <div className={`flex flex-row items-center justify-start space-x-3 group rounded-md overflow-hidden cursor-pointer hover:bg-gray-200 w-full px-3 py-2 ${active ? "bg-gray-200" : ""} ${loading && !active ? "opacity-50" : ""}`}>
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