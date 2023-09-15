import { UploadApiResponse } from "cloudinary"
import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import formidable from "formidable"
import { isEmpty } from "lodash"
import { twMerge } from "tailwind-merge"
import { v2 as cloudinary } from "cloudinary"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stringifyDatesInJSON = (data: any) => {

  const stringified = JSON.stringify(data, (k, v)=>{
    if(v instanceof Date) return v.toISOString()
    return v
  })


  return JSON.parse(stringified)

}

export const getAllDaysBetweenDates = (from: Date | string, to: Date | string) => {

  try {
  
  
      let is_same_date = dayjs(from).isSame(to, "date")
  
      if(is_same_date) {
  
          const sd = new Date()
          const day_start = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 0, 0, 0, 0)
  
          const val = [
              ...Array(24).fill(0)
          ]?.map((_, i)=>{
              return dayjs(day_start).add(i, "hour").toISOString()
          })

          return {
              is_same_date,
              val
          }
          
      }
  
      const days_between = dayjs(to).diff(from, "day")
  
      const val =  [
          ...Array(days_between).fill(0)
      ]?.map((_, i)=>{
          return dayjs(from).add(i, "day").toISOString()
      })

      
  
      return {
          is_same_date,
          val
      }

  }
  catch (e) {
      return {
          is_same_date: false,
          val: []
      }
  }



}


/**
 * @name get_today_start
 * @description - gets the beginning of the day 
 * @returns 
 */
export const get_today_start = () =>  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0)
/**
 * @name get_today_end
 * @description - gets the end of the day 
 * @returns 
 */
export const get_today_end = () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23, 59, 49, 999)

const matcher = /(customers|products|payments|payment_methods)\/.*/

export const route_matches = (path_name: string, store_id: string, base: string) => {
    return path_name?.replace("[store_id]", store_id)?.replace(matcher, "$1") === base
}


export const isSameHour = (date: Date | string, comp: Date | string) => dayjs(date).isSame(comp, "hour")

export const isSameDate = (date: Date | string, comp: Date | string) => {
    const d = new Date(date)
    const c = new Date(comp)
    return d.getFullYear() === c.getFullYear() && d.getMonth() === c.getMonth() && d.getDate() === c.getDate()
}


export const formatChartDate = (data: {date: Date | string, is_same_date: boolean, from: Date | string, to: Date| string}) => {
    const { date, is_same_date, from, to } = data
    return dayjs(date).format(
        is_same_date ? "hh A" :
        dayjs(from).isSame(to, "month") ? "D" :
        "MMM D"
    )
}





export const getUploadTimestamp = () => {
    return Math.round((new Date).getTime()/1000)
}