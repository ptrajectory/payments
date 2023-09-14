"use client"
import { Button } from '@/components/atoms/button'
import Logo from '@/components/atoms/logo'
import { Badge } from '@tremor/react'
import { Github, Package, Plug, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Page() {
  return (
    <div className="w-screen h-full flex flex-col items-center justify-start px-10 py-5">
        {/* Top Header */}
        <div className="flex flex-row items-center w-full justify-between">
          <div className="flex flex-row items-center space-x-2">
            <Logo/>
            <span className="text-lg font-medium">
                ptrajectory-payments
            </span>
          </div>
          <Link
            legacyBehavior 
            href="/sign-in"
          >
            <Button>
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero Section */}

        <section className="flex flex-col w-full items-center justify-end h-[50vh] space-y-3">
            

            <Badge>
              Follow along on youtube
            </Badge>
            <h1 className="text-4xl font-bold text-center w-[80%] ">
              Making mobile money payment intergrations easier for modern web developers.
            </h1>
            <p className='text-center w-[80%]' >
              I&apos;m building a mobile money payments sdk with typescript and open sourcing everything. Follow along as we figure this out together
            </p>

            <div className="flex flex-row items-center justify-center gap-x-5">
              <Button>
                <Github className='mr-2' size="20px" />
                Github
              </Button>

              <Button
                variant={"link"}
              >
                <Youtube className='mr-2' size="20px" />
                Listen to my rant
              </Button>
            </div>

        </section>

        {/* Intergrations */}

        <section className="flex flex-col w-full items-center space-y-4 justify-center h-[90vh]">
          <div className="flex flex-row items-center justify-center space-x-2">
            <Plug/>
            <h2 className='text-3xl' >
              Intergrations
            </h2>
            
          </div>
          <p
            className='text-center w-4/5'
          >
            This project is aimed at making it easier for developers to handle payments in their applications without having to write hundreds of lines of boilerplate code. <br /> <br />
          </p>

          <div className="grid grid-cols-3 w-full gap-x-5 gap-y-5">

            <div className="flex flex-col p-5 rounded-sm ring-1 ring-slate-300 space-y-2">
              <Image
                alt="logo"
                src="/logos/saf-logo.png"
                width={100}
                height={40}
              />
              <div className="flex flex-col w-full">
                <h4
                  className='text-sm font-medium'
                >
                  M-Pesa
                </h4>
                <p
                  className='text-sm font-normal' 
                >
                  MPesa express, MPesa B2C intergrations.
                </p>
                <Badge color='emerald' size="xs" className='mt-4' >
                  🏗️ in progress
                </Badge>
              </div>

            </div>


            <div className="flex flex-col p-5 rounded-sm ring-1 space-y-2 ring-slate-300">
              <Image
                alt="logo"
                src="/logos/airtel-logo.png"
                width={100}
                height={40}
              />
              <div className="flex flex-col w-full">
                <h4
                  className='text-sm font-medium'
                >
                  Airtel Money
                </h4>
                <p
                  className='text-sm font-normal' 
                >
                  Collections and Disbursement intergrations.
                </p>
                <Badge color='gray' size="xs" className='mt-4' >
                 📋 Backlog
                </Badge>
              </div>

            </div>


            <div className="flex flex-col p-5 rounded-sm ring-1 space-y-2 ring-slate-300">
              <div className="flex flex-row w-10 h-10 relative ">
                <Image
                  alt="logo"
                  src="/logos/mtn-momo.png"
                  width={100}
                  height={40}
                />
              </div>
              <div className="flex flex-col w-full">
                <h4
                  className='text-sm font-medium'
                >
                  Mtn Momo
                </h4>
                <p
                  className='text-sm font-normal' 
                >
                  Collections and Disbursement intergrations.
                </p>
                <Badge color='gray' size="xs" className='mt-4' >
                  📋 Backlog
                  </Badge>
              </div>
            </div>

          </div>


          

        </section>
          {/* Packages */}

          <section className="w-full flex flex-col items-center justify-center  ">
            <div className="flex flex-row items-center space-x-2">
              <Image
                src="/logos/npm-logo-black.svg"
                alt="NPM LOGO"
                width={40}
                height={40}
                
              />
              <h2 className='text-3xl' >
                Published Packages
              </h2>
            </div>
            <p
              className='text-center w-4/5'
            >
              I&apos;m not the best at naming stuff so, bear with me 😁
            </p>

            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-2">

            <div className="flex flex-row items-center justify-start w-full ring-1 p-2 rounded-sm">

                <Image
                  src="/logos/n.svg"
                  alt="npm square"
                  width={80}
                  height={80}
                />

                <div className="flex flex-col items-start justify-center">
                    <span className='' ></span>
                </div>

            </div>

            </div>
          </section>


          {/* Proudly opensource */}

          <section className="w-full items-center justify-center  ">

          </section>
    </div>
  )
}

export default Page