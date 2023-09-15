import db from "db"
import StoreEditForm from "./components/form"




interface PageProps {
    params: { store_id: string }
}



const getStoreData = async (store_id: string) => {

    try {
        const result = (await db.query.STORE.findFirst({
            where: (str, { eq }) => eq(str.id, store_id),
            columns: {
                id: true,
                name: true,
                description: true,
                image: true,
                environment: true
            }
        })) ?? null


        return result


    }
    catch (e)
    {
        return null
    }

}


export default async function Page(props: PageProps) {
    const { params: { store_id } } = props

    const data = await getStoreData(store_id)

    return (
        <div className="flex flex-col w-full h-full pb-[200px]">
            <StoreEditForm
                data={data}

            />
        </div>
    )

}