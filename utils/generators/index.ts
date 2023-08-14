import { randomBytes } from "crypto"

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



export {
    generate_unique_id,
    generate_dto
}