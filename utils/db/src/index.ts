import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from "postgres";
import * as schema from "./schema"
export * as schema from "./schema"
export * as utils from "./utils"

const queryClient = postgres(process.env.DATABASE_URL as string) 
const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, {
    schema
})
export default db
