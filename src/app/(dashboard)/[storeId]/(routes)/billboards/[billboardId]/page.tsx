import prisma from "@/lib/prismadb";
import BillBoardForm from "../components/BillBoardForm";

const BillBoardPage = async ({params}:{params:{billboardId:string}}) => {
    const billboardId = await params.billboardId
    console.log("params are",billboardId)
    const billboard = await prisma.billboard.findUnique({
        where:{
            id:billboardId
        }
    })
    console.log("data is ",billboard)

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillBoardForm initialData={billboard} />
            </div>
        </div>
    );
}

export default BillBoardPage;