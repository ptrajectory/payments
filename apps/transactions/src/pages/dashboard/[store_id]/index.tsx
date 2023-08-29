import DashboardTopBar from '@/components/organisms/dashboard-topbar'
import { Card, DateRangePicker, LineChart, List, ListItem, Title } from '@tremor/react'
import { HomeIcon, ShirtIcon, UserIcon } from 'lucide-react'
import React from 'react'
import dayjs from "dayjs"
import DashboardSideBarButton from '@/components/atoms/dashboard-sidebar-button'
import { GetServerSideProps } from 'next'
import { PageLayoutProps } from '@/lib/types'


const chart_data = [
    {
        total_purchases: 300,
        day: dayjs().day()
    },
    {
        total_purchased: 350,
        day: dayjs().subtract(1, "day").day()
    },
    {
        total_purchased: 250,
        day: dayjs().subtract(2, "day").day()
    },
    {
        total_purchased: 150,
        day: dayjs().subtract(3, "day").day()
    },
    {
        total_purchased: 30,
        day: dayjs().subtract(4, "day").day()
    },
    {
        total_purchased: 3350,
        day: dayjs().subtract(5, "day").day()
    },
    {
        total_purchased: 3540,
        day: dayjs().subtract(6, "day").day()
    },
]

function StorePage() {
  return (

                <div className="flex flex-col w-full h-full">

                    <div className="flex flex-col w-full space-y-3 pb-3 border-b-2 border-gray-200 mb-5">
                        <h1 className="text-lg font-semibold">
                            Your Overview
                        </h1>

                        <DateRangePicker/>
                    </div>


                    <div className="flex flex-row items-start justify-between w-full border-b-2 border-gray-200 mb-5 pb-3">


                        <div className="flex flex-col w-[30%] space-y-2">
                            <span className='text-sm font-medium' >
                                Successful Payments
                            </span>

                            <List className='w-full' >
                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>

                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>

                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>
                            </List>
                        </div>

                        <div className="flex flex-row w-[60%] ">
                        <Card>
                            <Title>
                                Daily total purchases
                            </Title>
                            <LineChart
                                data={chart_data}
                                index='day'
                                categories={['total_purchased']}
                                colors={['amber']}
                            />
                        </Card>

                        </div>


                    </div>

                    <div className="flex flex-row items-center justify-between w-full">

                        <div className="flex flex-col w-[30%] space-y-2">
                            <span className='text-sm font-medium' >
                                Failed Payments
                            </span>

                            <List className='w-full' >
                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>

                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>

                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>
                            </List>
                        </div>

                        <div className="flex flex-col w-[30%] space-y-2">
                            <span className='text-sm font-medium' >
                                Most Purchased Products
                            </span>

                            <List className='w-full' >
                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>

                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>

                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>
                            </List>
                        </div>


                        <div className="flex flex-col w-[30%] space-y-2">
                            <span className='text-sm font-medium' >
                                New Customers
                            </span>

                            <List className='w-full' >
                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>

                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>

                                <ListItem>

                                    <span>
                                        James Dean
                                    </span>

                                    <span>
                                        KES 400
                                    </span>

                                </ListItem>
                            </List>
                        </div>

                    </div>

                    

                </div>



      
  )
}

export default StorePage

export const getServerSideProps: GetServerSideProps<PageLayoutProps> = async () => {
    return {
        props: {
            layout: "dashboard",
        }
    }
}