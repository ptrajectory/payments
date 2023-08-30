import { getAuth } from "@clerk/nextjs/server";
import { isEmpty, isUndefined } from "lodash";
import { NextApiHandler } from "next";
import db from "db"
import { eq } from "db/utils";
import { SELLER, STORE } from "db/schema";
import { generate_dto, generate_unique_id } from "generators";
import { store, SELLER as tSELLER, STORE as tSTORE } from "zodiac";



const hander: NextApiHandler = async (req, res) => {
    
    const method = req.method 
    const body = req.body
    const store_id = req.query?.slug?.at(0)
    const { page = 1, size = 10, order = "desc" } = req.query as {
        page: string,
        size: string,
        order: "asc" | "desc"
    }
    const auth = getAuth(req)
    const uid = auth?.userId


    if(isEmpty(uid)) return res.status(401).send("Unauthorized")

    switch(method){

        case "POST":{
            const parsed = store.safeParse(body)

            if(!parsed.success) return res.status(400).send(generate_dto(
                parsed.error.formErrors,
                "INVALID BODY",
                "error"
            ))

            const data = parsed.data

            console.log("DATA", data)

            let user: tSELLER | null | undefined = null
            try {
                user = await db.query.SELLER.findFirst({
                    where: eq(SELLER.uid, uid)
                })

                console.log("USER", user)

                const result = await db.insert(STORE).values({
                    ...data,
                    id: generate_unique_id("str"),
                    created_at: new Date(),
                    updated_at: new Date(),
                    seller_id: user?.id,
                } as tSTORE).returning()

                console.log("RESULT", result)


                return res.status(201).send(
                    generate_dto(
                        result?.at(0),
                        "CREATED STORE SUCCESSFULLY",
                        "success"
                    )
                )
            }
            catch (e)
            {
                console.log("ERROR", e)
                return res.status(500).send(generate_dto(null, "Something went wrong", "error"))
            }

            return
        }
        case "GET": {

            let user: tSELLER | null | undefined = null


            try {

                user = await db.query.SELLER.findFirst({
                    where: eq(SELLER.uid, uid)
                })
    
                if(isUndefined(store_id)){
    
                    const stores = await db.query.STORE.findMany({
                        where: eq(STORE.seller_id, user?.id),
                        orderBy: STORE.created_at,
                        limit: Number(size),
                        offset: (Number(page) - 1) * (Number(size))
                    })

                    return res.status(200).send(generate_dto(stores, "FETCHED STORES", "success"))
    
                }


                const store = await db.query.STORE.findFirst({
                    where: eq(STORE.id, store_id)
                })

                return res.status(200).send(generate_dto(store, "FETCHED", "success"))

            }
            catch (e)
            {
                return res.status(500).send(generate_dto(null, "SOMETHING went wrong", "error"))
            }


            return 
        }
        default: 
            return res.status(405).send("Method not allowed")

    }

}   

export default hander