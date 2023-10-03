import z, { ZodObject } from "zod";


/**  
 * !!! IMPORTANT - internal use only, unable to get typescript to work with zod objects so...
 * @name parser
 * @param zodparser {ZodObject}
 * @param data {any}
 * @description jst for the sake of DRY, got tired repeating this
*/ 
export const parser = <T>(zodparser: any, data: any): T => {

    const parsed = zodparser.safeParse(data)
 
    if(!parsed.safeParse){
        throw parsed.error
    }

    return parsed.data

}

