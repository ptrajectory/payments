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
    <div className="w-screen h-full flex flex-col items-center justify-start px-2 md:px-10 py-5">
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
            href="/dashboard"
          >
            <div className="flex flex-row items-center justify-center relative">
              <Button className='hidden lg:flex cursor-pointer z-50' >
                Dashboard
              </Button>
              <div className="hidden lg:flex absolute underline-background top-2 right-1 z-10"></div>
            </div>
          </Link>
        </div>

        {/* Hero Section */}

        <section className="flex flex-col w-full items-center justify-end h-[50vh] space-y-3 mb-10 sm:mb-8 md:mb-0 ">
            
            <Link href="https://www.youtube.com/channel/UC7k2-DHa-l4K6b77duEuzXQ" legacyBehavior>
              <Badge className='cursor-pointer' >
                Follow along on youtube
              </Badge>
            </Link>
            <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-center w-[90%] sm:w-[80%] ">
              Making mobile money payment intergrations easier for modern web developers.
            </h1>
            <p className='text-xs sm:text-sm md:text-base text-center w-[80%]' >
              I&apos;m building a mobile money payments sdk with typescript and open sourcing everything. Follow along as we figure this out together
            </p>

            <div className="flex flex-row items-center justify-center gap-x-5">
            <Link href="https://github.com/ptrajectory/payments" legacyBehavior>
                <Button className='' >
                  <Github className='mr-2' size="20px" />
                  Github
                </Button>
            </Link>

              <Link href="https://youtu.be/-o12FEldE34?si=DDK_M7TX1OQFn5Sr" legacyBehavior>
                <Button
                  variant={"link"}
                >
                  <Youtube className='mr-2' size="20px" />
                  Listen to my rant
                </Button>
              </Link>
            </div>

        </section>

        {/* Intergrations */}

        <section className="flex flex-col w-[90%] md:w-4/5 items-center space-y-4 justify-center h-auto md:h-[90vh] mb-10 sm:mb-8 md:mb-0">
          <div className="flex flex-row items-center justify-center space-x-2">
            <Plug/>
            <h2 className='text-lg sm:text-2xl md:text-3xl' >
              Intergrations
            </h2>
            
          </div>
          <p
            className='text-xs sm:text-sm md:text-base text-center w-4/5'
          >
            This project is aimed at making it easier for developers to handle payments in their applications without having to write hundreds of lines of boilerplate code. <br /> <br />
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-x-5 gap-y-5">

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

          <section className="w-full flex flex-col items-center justify-center mb-10 sm:mb-8 md:mb-0  ">
            <div className="flex flex-row items-center space-x-2">
              <Image
                src="/logos/npm-logo-black.svg"
                alt="NPM LOGO"
                width={40}
                height={40}
                
              />
              <h2 className='text-lg sm:text-2xl md:text-3xl font-bold' >
                Published Packages
              </h2>
            </div>
            <p
              className='text-xs sm:text-sm md:text-base text-center w-4/5'
            >
              I&apos;m not the best at naming stuff so, bear with me 😁
            </p>

            <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-10 mt-10 gap-y-5">

              <Link href="https://www.npmjs.com/package/porkytheblack-mpesa" legacyBehavior >
                <div role="button" className="flex flex-row items-center cursor-pointer hover:shadow-sm justify-start w-full ring-1 p-2 rounded-sm gap-x-5">

                    <Image
                      src="/logos/n.svg"
                      alt="npm square"
                      width={80}
                      height={80}
                    />

                    <div className="flex flex-col items-start justify-center">
                        <span className='font-semibold text-lg' >
                          porkytheblack-mpesa
                        </span>
                        <p>
                          A simple to use library for directly intergrating with MPESA&apos;s daraja api. 
                        </p>
                        <Badge>
                          v0.3.1
                        </Badge>
                    </div>

                </div>
              </Link>

              <Link href="https://www.npmjs.com/package/ptrajectory-mpesa-payments-ui" legacyBehavior >
                <div role="button" className="flex flex-row items-center cursor-pointer hover:shadow-sm justify-start w-full ring-1 p-2 rounded-sm gap-x-5">

                    <Image
                      src="/logos/n.svg"
                      alt="npm square"
                      width={80}
                      height={80}
                      />

                    <div className="flex flex-col items-start justify-center">
                        <span className='font-semibold text-lg' >
                          ptrajectory-mpesa-payments-ui
                        </span>
                        <p>
                          A react library with prebuilt forms for collecting customer information.
                        </p>
                        <Badge>
                          v0.1.0
                        </Badge>
                    </div>

                </div>
              </Link>


              <div role="button" className="flex flex-row items-center cursor-pointer hover:shadow-sm justify-start w-full ring-1 p-2 rounded-sm gap-x-5">

                  <Image
                    src="/logos/n.svg"
                    alt="npm square"
                    width={80}
                    height={80}
                  />

                  <div className="flex flex-col items-start justify-center">
                      <span className='font-semibold text-lg' >
                        ptrajectory-payments-node
                      </span>
                      <p>
                        A node sdk for interacting with the ptrajectory-payments api
                      </p>
                      <Badge color='amber' >
                        in the oven!
                      </Badge>
                  </div>

              </div>

            </div>

            <p className='text-xs sm:text-sm md:text-base text-center w-4/5' >
              A lot of these packages are still in early development stages, but I hope to have v1&apos;s soon enough.
            </p>
          </section>


          {/* Proudly opensource */}

          <section className="w-full items-center justify-center h-auto md:h-[40vh] flex flex-col gap-y-3">

              <h1 className="text-2xl sm:text-3xl md:text-5xl text-center font-bold">
                Proudly Open Source.
              </h1>

              <p className='text-xs sm:text-sm md:text-base text-center w-4/5'  >
                All the code is available on <a className='text-white bg-black p-1 cursor-pointer' href="https://github.com/ptrajectory/payments">github</a> feel free to contribute.
              </p>

          </section>


          {/* Footer Section */}
          <section className="w-full items-center justify-center pt-10 ">
            <p className='text-xs sm:text-sm md:text-base text-center w-4/5' >
              Built with ♥️ and ⚡️⚡️ by <a className='text-white bg-black p-1 cursor-pointer' href="https://github.com/porkytheblack">don</a> . Star on <a className='text-white bg-black p-1 cursor-pointer' href="https://github.com/ptrajectory/payments">github</a>
            </p>
          </section>
    </div>
  )
}

export default Page