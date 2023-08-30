import payments from "@/lib/resources/payments";
import { getAllDaysBetweenDates, get_today_end, get_today_start } from "@/lib/utils";
import { getAuth } from "@clerk/nextjs/server";
import { PAYMENT } from "db/schema";
import { sql } from "db/utils";
import { generate_dto } from "generators";
import { isEmpty, isString, isUndefined } from "lodash";
import { NextApiHandler } from "next";
import Payments from "ptrajectory-payments-node"
import db from "db"
import dayjs from "dayjs";


const get_purchase_overview = (from: string, to: string, customer_id: string) => sql`
    select COUNT(p.*) as number_of_purchases, SUM(p.amount) as amount_purchased, p.created_at as day
    from ${PAYMENT} as p
    where p.customer_id = ${customer_id} 
    and p.created_at > ${from}
    and p.created_at < ${to}
    group by p.id
`


const handler: NextApiHandler = async (req, res) => {

    const method = req.method 
    const body = req.body
    const { customers_slug, section, from = get_today_start().toISOString(), to = get_today_end().toISOString() } = req.query 

    console.log(req.query)
    const customer_id = (customers_slug as Array<string>)?.at(0)
    console.log("The customer_id", customer_id)
    const auth = getAuth(req)
    const user_id = auth?.userId 

    if(isEmpty(user_id) || isUndefined(user_id)) return res.status(401).send(generate_dto(null, "UNAUTHORIZED", "error"))

    switch(method){
        case "POST": {
            try {
                const customer = await payments.customer?.createCustomers(body)

                return res.status(201).send(generate_dto(customer, "CUSTOMER CREATED SUCCESSFULLY", "success"))
            }
            catch(e)
            {
                return res.status(500).send(generate_dto(e, "Something went wrong", "error"))
            }


            return 
        };
        case "GET": {

            
            
            
            
            if(isEmpty(customer_id) || !isString(customer_id)) return res.status(400).send(generate_dto(null, "CUSTOMER ID IS REQUIRED", "error"))

            if(isString(section) && section === "purchase_overview" && isString(from) && isString(to)) {

                const range_purchase_overview = (await db.execute(get_purchase_overview(from, to, customer_id))) as Array<{
                    number_of_purchases: string 
                    amount_purchased: string | null
                    created_at: string
                }>

                console.log("Purchase overview::", range_purchase_overview)
                

                const dates_between = getAllDaysBetweenDates(from, to)

                const data_for_graph = dates_between?.val?.map((date, i)=>{

                    const purchases_value_agg = range_purchase_overview?.reduce((prev, cur)=>{
                        const num = Number(cur?.number_of_purchases)

                        if (dates_between?.is_same_date) {


                            if(dayjs(cur?.created_at).isSame(date, "hour")) return prev + (isNaN(num) ? 0 : num)
                            
                            return prev + 0

                        }

                        if(dayjs(cur?.created_at).isSame(date, "date") && dayjs(cur?.created_at).isSame(date, "month") && dayjs(cur?.created_at).isSame(date, "year")) return prev + (isNaN(num) ? 0 : num)

                        return prev + 0
                    }, 0)

                    const amount_value_agg = range_purchase_overview?.reduce((prev, cur)=>{

                        const num = Number(cur?.amount_purchased)

                        if (dates_between?.is_same_date) {


                            if(dayjs(cur?.created_at).isSame(date, "hour")) return prev + (isNaN(num) ? 0 : num)
                            
                            return prev + 0

                        }

                        if(dayjs(cur?.created_at).isSame(date, "date") && dayjs(cur?.created_at).isSame(date, "month") && dayjs(cur?.created_at).isSame(date, "year")) return prev + (isNaN(num) ? 0 : num)

                        return prev + 0
                    }, 0)

                    return {
                        day: dayjs(date).format(
                            dates_between?.is_same_date ? "hh A" :
                            dayjs(from).isSame(to, "month") ? "D" :
                            "MMM D"
                        ),
                        number_of_purchases: purchases_value_agg ?? 0,
                        amount_purchased: amount_value_agg
                    }

                })

                return res.status(200).send(generate_dto(
                    data_for_graph,
                    "SUCCESSFULLY FETCHED CHART DATA",
                    "success"
                ))
                return 
            }
            try{
                const customer = await payments.customer?.getCustomer(customer_id)

                return res.status(200).send(generate_dto(customer, "CUSTOMER FOUND", "success"))
            }
            catch (e)
            {
                return res.status(500).send(generate_dto(e, "Something went wrong", "error"))
            }

            return
        };
        case "PUT": {

            if(isEmpty(body)) return res.status(400).send(generate_dto(null, "INVALID BODY", "error"))
            if(isEmpty(customer_id) || isUndefined(customer_id)) return res.status(400).send(generate_dto(null, "CUSTOMER ID IS REQUIRED", "error"))

            try {

                const customer = await payments.customer?.updateCustomer(customer_id, body)

                return res.status(200).send(generate_dto(customer, "CUSTOMER UPDATED", "success"))
            }
            catch (e){
                return res.status(500).send(generate_dto(e, "SOMETHING WENT WRONG", "error"))
            }
            return 
        }
        default: {
            return res.status(405).send(generate_dto(null, "METHOOD NOT ALLOWED", "error"))
        }
    }

}

export default handler