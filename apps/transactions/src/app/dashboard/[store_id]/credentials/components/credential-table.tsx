import db from "db";
import KeysTable from "./keys-table";


const getStoreCredentials = async (store_id: string) =>{

    try {

        const result = await db.query.STORE.findFirst({
            where: (str, {eq}) => eq(str.id, store_id),
            columns: {
                prod_secret_key: true,
                test_secret_key: true,
                prod_publishable_key: true,
                test_publishable_key: true,
                created_at: true
            }
        })

        return result ?? null

    }
    catch (e)
    {
        // TODO: better error handling
        return null
    }

}


export default async function CredentialTable (props: { store_id: string }) {
    const {store_id} = props

    const credentials = await getStoreCredentials(store_id)

    return (
        <div className="flex flex-col w-full space-y-5">
                <KeysTable
                    title="Publishable Keys"
                    data={[
                        {
                            id: credentials?.created_at ?? "",
                            value: credentials?.prod_publishable_key,
                        },
                        {
                            id: credentials?.created_at ?? "",
                            value: credentials?.test_publishable_key,
                        }
                    ]}
                />

                <KeysTable
                    title="Secret Keys"
                    data={[
                        {
                            id: credentials?.created_at ?? "",
                            value: credentials?.prod_publishable_key,
                        },
                        {
                            id: credentials?.created_at ?? "",
                            value: credentials?.test_publishable_key,
                        }
                    ]}
                />

        </div>
    )

}