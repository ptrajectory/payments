import { randomBytes } from "crypto"
import fs from "fs"
import jwt from "jsonwebtoken"

/**
 * 
 * @param entity_abrv - entity abbreviation e.g "cus" for customer or "pm" for payment method
 * @returns {string} - unique_id prefixed with the entity abbreviation e.g "cus_1234"
 * 
 */
const generate_unique_id = (entity_abrv: String): string => {
    const unique_id = randomBytes(16).toString("hex")
    return `${entity_abrv}_${unique_id}`
}



/**
 * Use this function to generate a data transfer object to be sent to the client 
 * - @example
 * ```ts
 * const dto = generate_dto(data, "some", "status")
 * 
 * console(dto)
 * ```
 * @param data 
 * @param message 
 * @param status 
 * @returns 
 */
function generate_dto<T>(data: T, message: string, status: "error" | "success") {
    return  {
        message,
        status,
        data
    }
}

/**
 * Use this function to generate store secret keys to be used by the node library
 * @param payload 
 * @returns token
 */
const generate_store_secret = (payload: {
    store_id: string,
    seller_id: string,
    env: "production" | "testing"
}) => {

    const privateKey = fs.readFileSync("./keys/private-key.pem", 'utf-8')

    const token = jwt.sign({
        sub: payload.seller_id,
        aud: payload.store_id,
        iat: new Date().toTimeString(),
        data: payload
    }, privateKey, {
        algorithm: "RS256"
    })

    return token 

}

/**
 * - Use to verify jwt token
 * @param token 
 * @returns 
 */
const verify_store_secret = (token: string) => {

    const publicKey = fs.readFileSync("./keys/public-key.pem", 'utf-8')

    const payload = jwt.verify(token, publicKey) as jwt.JwtPayload & {
        data: {
            store_id: string
            seller_id: string
            env: "production" | "testing"
        }
    }


    return payload

}



export {
    generate_unique_id,
    generate_dto,
    generate_store_secret,
    verify_store_secret
}