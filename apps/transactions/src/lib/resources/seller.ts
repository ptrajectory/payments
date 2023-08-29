import db from "db"
import { SELLER } from "db/schema"
import { eq } from "db/utils"
import { isEmpty, isNull, isUndefined } from "lodash"
import {sleep} from "functions"
import { type SELLER as SELLERType } from "zodiac"
 



/**
 * @name getSeller
 * @description - used to retrieve the seller object from the db with debounce functionality in place
 * @param id 
 * @param trial 
 * @returns 
 */
export const getSeller = async (id: string | null, trial: number = 0): Promise<SELLERType | null> => {

    if(isNull(id)) return Promise.reject(Error("ID PROVIDED IS NULL"))
 
    try {

        const seller = await db.query.SELLER.findFirst({
            where: id?.startsWith("user") ? eq(SELLER.uid, id) :
            eq(SELLER.id, id)
        }) as SELLERType

        if((isEmpty(seller) || isUndefined(seller) || isNull(seller)) && trial < 20) {
            await sleep(1000)
            return getSeller(id, trial + 1)
        }

        return seller

    }
    catch (e) 
    {
        return null
    }


}