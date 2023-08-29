import DashboardTopBar from "@/components/organisms/dashboard-topbar";
import { PageLayoutProps } from "@/lib/types";
import { PlusIcon, ShirtIcon, User } from "lucide-react";
import { GetServerSideProps } from "next";



export default function DashboardPage () {
    return (
            <div className="w-full h-full flex flex-col items-center justify-start">
                <div className="flex flex-col items-center justify-start w-4/5 space-y-5">


                    <div className="flex flex-row items-center justify-start w-full">
                        <h1 className="text-3xl font-medium" >
                            Stores
                        </h1>
                    </div>

                    <div className="grid grid-cols-3 gap-x-5 gap-y-5 w-full h-full">

                        <div className="flex flex-col items-center cursor-pointer justify-center rounded-lg border-2  border-gray-200 p-5 hover:shadow-md">
                            <PlusIcon/>
                            <span className="font-medium text-sm">
                                Add Store
                            </span>
                        </div>



                        <div className="flex flex-col items-center cursor-pointer justify-start rounded-lg border-2 overflow-hidden  border-gray-200 hover:shadow-md">

                            <div className="flex flex-row items-center justify-center w-full p-5 bg-blue-600 ">
                                <span className="text-white font-medium" >
                                    Ptrajectory Store
                                </span>
                            </div>
                            <div className="flex flex-col w-full items-start space-y-2 px-5 py-4">
                                <div className="flex flex-row items-end justify-start gap-x-4">
                                    <User className="text-xs" />
                                    <span>
                                        20 customers
                                    </span>
                                </div>
                                <div className="flex flex-row items-end justify-start gap-x-4">
                                    <ShirtIcon className="text-xs" />
                                    <span>
                                        10 products
                                    </span>
                                </div>


                            </div>
                        </div>

                        

                    </div>


                </div>
            </div>
    )
}


export const getServerSideProps: GetServerSideProps<PageLayoutProps> = async () => {
    return {
        props: {
            layout: "dashboard",
            hide_sidebar: true
        }
    }
}