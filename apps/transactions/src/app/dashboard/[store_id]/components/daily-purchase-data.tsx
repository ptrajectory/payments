"use server"

import HomeDailyPurchases from "@/components/organisms/charts/home-daily-purchases"
import { fetch_home_daily_purchases_chart_data } from "@/components/organisms/charts/utils"


export default async function DailyPurchaseData(props:{store_id: string}) {
    const { store_id } = props
    const data = await fetch_home_daily_purchases_chart_data(store_id, {})

    return <HomeDailyPurchases
        initialData={data}
    />

}