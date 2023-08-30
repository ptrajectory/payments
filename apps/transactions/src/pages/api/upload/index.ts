import { getAuth } from "@clerk/nextjs/server";
import { generate_dto } from "generators";
import { flatten, isEmpty, isUndefined } from "lodash";
import { NextApiHandler } from "next";
import formidable from "formidable"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



const handler: NextApiHandler = async (req, res) => {

    const auth = getAuth(req)


    if(isEmpty(auth?.userId) || isUndefined(auth?.userId)) return res.status(401).send(generate_dto(null, "UNAUTHORIZED", "error"))

    const form = formidable({
        multiples: true
    })

    form.parse(req, (err, _, files) => {

        if(err) {
            return res.status(500).send(generate_dto(null, "SOMETHING WENT WRONG", "error"))
        }

        const all_files = flatten(Object.values(files))

        for (const file_to_upload of all_files) {
            cloudinary.uploader.upload((file_to_upload)?.filepath, {
                folder: "ptrajectory-payments-dashboard-uploads",
            }, (err, result)=> {
                if(err) return res.status(500).send(generate_dto(null, "SOMETHING WENT WRONG", "error"))
                console.log("The result", result)
                return res.status(201).send(generate_dto(result, "UPLOADED", "success"))
            })
        }

    })
}

export default handler

export const config = {
    api: {
        bodyParser: false
    }
}