import { getSeller } from "@/lib/resources/seller";
import { getAuth } from "@clerk/nextjs/server";
import { generate_dto } from "generators";
import { NextApiHandler } from "next";



const handler: NextApiHandler = async (req, res) => {

    const method = req.method
    const auth = getAuth(req)
    const user_id = auth.userId

    switch(method){
        case "GET":{
            try {
                const seller = await getSeller(user_id)

                return res.status(200).send(
                    generate_dto(
                        seller,
                        "SELLER RETRIEVED",
                        "success"
                    )
                )

            }
            catch (e) 
            {
                return res.status(500).send(
                    generate_dto(
                        null,
                        "UNKNOWN ERROR",
                        "error"
                    )
                )
            }
            return
        };
        default: 
            return res.status(405)
    }

}

export default handler