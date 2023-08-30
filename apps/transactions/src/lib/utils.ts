import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"

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
  
          console.log(day_start)
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