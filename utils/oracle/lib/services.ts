import { Column, SQL } from "drizzle-orm"


export interface IService< C = any, U = any, R = any > {
    create: (arg: C)=>Promise<R|null>
    update: (id: string, arg: U)=> Promise<R|null>
    delete: (id: string)=> Promise<R|null>
    retrieve: (id: string) => Promise<R|null>
    list: (query: SQL| null ,  start?: number, size?: number, columns?: Record<keyof R | string, boolean>, orderBy?: Column<any> ) => Promise<Array<R|null>>
}