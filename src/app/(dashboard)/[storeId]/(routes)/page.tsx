import prisma from "@/lib/prismadb"


interface DashboardPageProps{
    params:{
        storeId: string
    }
}

const DashboardPage = async  ({params}:DashboardPageProps) =>{
    const storeId = await params.storeId
    const Store = await prisma.store.findFirst({
        where:{
            id:storeId
        }
    })
    console.log(Store)

    return(
        <div>
            welcome to {Store?.name}
        </div>
    )
}
export default DashboardPage;