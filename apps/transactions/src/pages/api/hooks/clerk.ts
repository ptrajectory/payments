import { WebhookEvent } from "@clerk/nextjs/server";
import { NextApiHandler } from "next";
import db from "db"
import { SELLER } from "db/schema";
import { generate_unique_id } from "generators"



const handler: NextApiHandler = async (req, res) => {

    res.status(200).send("OK")

    const event: WebhookEvent = req.body


    try {

        switch(event.type){

            case "user.created": {

                const user = event.data
                const email_id = user?.primary_email_address_id 
                const email = user?.email_addresses?.find(({id}) => id === email_id)?.email_address

                if(!email) return null //TODO: add logger

                const result = await db.insert(SELLER).values({
                    id: generate_unique_id("sll"),
                    email: email,
                    avatar: user?.image_url,
                    first_name: user?.first_name,
                    last_name: user?.last_name,
                    uid: user.id
                }).returning()

                console.log(
                    "New User",
                    result.at(0)
                )

            }

            //TODO: add update and delete caeses

        }

    }
    catch (e) 
    {

    }

}

export default handler