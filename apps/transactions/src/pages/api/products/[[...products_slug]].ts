import payments from "@/lib/resources/payments";
import { getAllDaysBetweenDates, get_today_end, get_today_start } from "@/lib/utils";
import { getAuth } from "@clerk/nextjs/server";
import { CART, CART_ITEM, CHECKOUT, PAYMENT } from "db/schema";
import { sql } from "db/utils";
import { generate_dto } from "generators";
import { isArray, isEmpty, isNull, isString } from "lodash";
import { NextApiHandler, NextApiRequest } from "next";
import db from "db"
import dayjs from "dayjs";


const get_purchase_overview = (from: string, to: string, product_id: string) => sql`
    select COUNT(p.*) as number_of_purchases, SUM(p.amount) as amount_purchased, p.created_at as day
    from ${PAYMENT} as p
    join ${CHECKOUT} as chk on chk.id = p.checkout_id
    join ${CART} as crt on crt.id = chk.cart_id
    join ${CART_ITEM} as crt_itm on crt_itm.cart_id = crt.id
    where crt_itm.product_id = ${product_id}
    and p.created_at > ${from}
    and p.created_at < ${to}
    group by p.id
`


const handler: NextApiHandler = async (req, res) => {

    const method = req.method
    const body = req.body
    const { products_slug, section, from = get_today_start().toISOString(), to = get_today_end().toISOString()} = req.query 

    const [product_id] = isArray(products_slug) ? products_slug : []
    
    const auth = getAuth(req)

    if(isNull(auth.userId)) return res.status(401).send(generate_dto(null, "UNAUTHORIZED", "error"))


    switch (method){
        case "POST":{

            try {
                const product = await payments.product?.createProduct(body)

                return res.status(201).send(generate_dto(product, "CREATED SUCCESSFULLY", "success"))
            }
            catch (e)
            {
                console.log("THE ERROR", e)
                return res.status(500).send(generate_dto(null, "SOMETHING WENT WRONG", "error"))
            }

            return 
        };
        case "GET": {

            if(!isString(product_id)) return res.status(400).send(generate_dto(null, "PRODCUT ID IS REQUIRED", "error"))

            if(isString(section) && section === "product_purchase_overview") {


                const range_purchase_overview = (await db.execute(get_purchase_overview(from as string, to as string, product_id))) as Array<{
                    number_of_purchases: string 
                    amount_purchased: string | null
                    created_at: string
                }>

                console.log("Purchase overview::", range_purchase_overview)
                

                const dates_between = getAllDaysBetweenDates(from as string, to as string)

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
                            dayjs(from as string).isSame(to as string, "month") ? "D" :
                            "MMM D"
                        ),
                        number_of_purchases: purchases_value_agg ?? 0,
                        amount_purchased: amount_value_agg
                    }

                })




                return res.status(200).send(generate_dto(data_for_graph, "SUCCESSFULLY FETCHED DATA", "success"))
            }

            return 
        }
        default: {
            return res.status(405).send(generate_dto(null, "METHOD NOT ALLOWED", "error"))
        }
    }

}

export default handler