import { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import db from "db"
import * as schema from "db/schema"

export type APPCLIENTS = {
    db: PostgresJsDatabase<typeof schema> | null
}

export const clients: APPCLIENTS = {
    db: db
}