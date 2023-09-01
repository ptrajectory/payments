import { cn } from "@/lib/utils"

interface SkeletonBlockProps {
    className?: string
}
export const SkeletonBlock = (props: SkeletonBlockProps) => {
    return (
        <div className={cn("flex flex-row bg-slate-100 animate-pulse rounded-sm", props.className)}>

        </div>
    )
}

export const HomeSkeleton = () => {


    return (

        <div className="flex flex-col w-full h-full space-y-5 p-5">

            <SkeletonBlock
                className="w-1/3 h-[60px]"
            />

            <div className="flex flex-row w-full h-[30vh] justify-between">

                <div className="h-full flex flex-col space-y-2 w-[35%]">
                    {
                        [...Array(5).fill(0)]?.map((_,i)=>{
                            return <SkeletonBlock key={i} className="w-full p-5" />
                        })
                    }
                </div>
                <SkeletonBlock
                    className="w-[60%] h-full"
                />


            </div>

            <div className="flex w-full flex-wrap justify-between  space-y-3">
                    {
                        [...Array(3).fill(0)]?.map((_,i)=>{
                            return <SkeletonBlock key={i} className="w-[45%] h-[20vh]" />
                        })
                    }
            </div>

        </div>

    )

}


export const TablePageSkeleton = (props: {
    table_length?: number
}) => {
    const { table_length } = props
    return (
        <div className="flex flex-col w-full h-full px-5 space-y-5">

            <div className="flex flex-row w-full justify-between">

                <SkeletonBlock
                    className="w-[10%] p-5"
                />

                <SkeletonBlock
                    className="w-[20%] p-5"
                />

            </div>

            <div className="flex flex-col w-full h-full space-y-2">

                <SkeletonBlock className="w-full p-5" />

                <div className="grid grid-cols-4 w-full gap-x-2 gap-y-2">

                    {
                        [...Array(((table_length) ?? 4)*10).fill(0)]?.map((_, i)=>{
                            return (
                                <SkeletonBlock key={i} className="w-full p-3" />
                            )
                        })
                    }

                </div>

                <div className="flex flex-row w-full justify-between">
                    <SkeletonBlock
                        className="p-2 w-[15%]"
                    />

                    <div className="flex flex-row items-center space-x-3">

                        <SkeletonBlock className="p-2 w-[100px]" />
                        <SkeletonBlock className="p-2 w-[100px]" />
                        <SkeletonBlock className="p-2 w-[100px]" />
                    </div>
                </div>

            </div>


        </div>
    )
}


export const CustomerPageSkeleton = () => {
    return (
        <div className="flex flex-col w-full h-full space-y-5">
            
            <div className="flex flex-row items-center w-full justify-between">

                <div className="flex flex-col w-[200px] space-y-2">

                    <SkeletonBlock className="w-full p-2" />
                    <SkeletonBlock className="w-full p-2" />
                    <SkeletonBlock className="w-full p-2" />

                </div>

                <SkeletonBlock className="w-[10%] p-3" />


            </div>

            <div className="flex flex-row items-center justify-between w-full gap-x-2">

                <SkeletonBlock className="w-1/2 p-10" />
                <SkeletonBlock className="w-1/2 p-10" />

            </div>

            <TablePageSkeleton
                table_length={5}
            />

            <SkeletonBlock className="w-full h-[30vh]" />

            <TablePageSkeleton
                table_length={10}
            />

        </div>
    )
}


export const ProductPageSkeleton = () => {
    return (
        <div className="flex flex-col w-full h-full space-y-5">
            
            <div className="flex flex-row items-center w-full justify-between">

                <div className="flex flex-col w-[200px] space-y-2">

                    <SkeletonBlock className="w-full p-2" />
                    <SkeletonBlock className="w-full p-2" />
                    <SkeletonBlock className="w-full p-2" />

                </div>

                <SkeletonBlock className="w-[10%] p-3" />


            </div>

            <div className="flex flex-row items-center justify-between w-full gap-x-2">

                <SkeletonBlock className="w-1/2 p-10" />
                <SkeletonBlock className="w-1/2 p-10" />

            </div>

            <SkeletonBlock className="w-full h-[30vh]" />


        </div>
    )
}