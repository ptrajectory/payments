import { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import db from "./db"

export type APPCLIENTS = {
    db: PostgresJsDatabase | null
}

export const clients: APPCLIENTS = {
    db: db
}