import { getUploadTimestamp } from "@/lib/utils"
import { auth } from "@clerk/nextjs"
import { UploadApiResponse } from "cloudinary"
import formidable, {  } from "formidable"
import { generate_dto } from "generators"
import { isEmpty, isNull, isUndefined, lte } from "lodash"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// !!! IMPORTANT - this is here because of an import issue I'm yet to resolve
const uploadFile = async (form: FormData) => {

    const timestamp = getUploadTimestamp()
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        folder: "ptrajectory-payments-dashboard-uploads-dev"
    },
        process.env.CLOUDINARY_API_SECRET as string
    )

    let uploads: Array<UploadApiResponse> = []
    console.log("reached here", form)
    for (const [key, value] of Array.from(form.entries())){
        console.log("KEY",key)
        if(!isUndefined(value)){

            const UploadForm = new FormData()
            UploadForm.append("api_key", process.env.CLOUDINARY_API_KEY as string)
            UploadForm.append("timestamp", timestamp.toString())
            UploadForm.append("signature", signature)
            UploadForm.append("folder", "ptrajectory-payments-dashboard-uploads-dev")
            UploadForm.append("file", value)

            try {
                const result = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`, {
                    body: UploadForm,
                    method: "POST"
                })
    
                if(result.ok){
                    console.log("done")
                    const data = await result.json()
                    uploads.push(data)
                }
    
                else {
                    console.log("error")
                    return Promise.reject(
                        `UNABLE TO UPLOAD ${key}`
                    )
                }

            }
            catch (e)
            {
                return Promise.reject("SOMETHING WENT WRONG")
            }
        }
    }

    return uploads
    

}



export const POST = async (req: Request) => {

    const { userId } = auth()


    if(isNull(userId)) return NextResponse.json(generate_dto(null, "UNAUTHORIZED", "error"), {
        status: 401
    })
    
    const form = await req.formData()

    try {

        const uploaded = await uploadFile(form)

        return NextResponse.json(generate_dto(uploaded?.at(0), "UPLOADED", "success"), {
            status: 201
        })

    }
    catch (e)
    {
        console.log("SOMETHING WENT WRONG::",e)

        return NextResponse.json(generate_dto(null, "SOMETHING WENT WRONG", "error"))
    }

}