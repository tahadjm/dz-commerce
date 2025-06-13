import prisma from "@/lib/prismadb";
import { BillBoardClient } from "./components/client";
import { BillboardColumn } from './components/columns';
import {format} from "date-fns"


const BillBoardsPage = async ({ params }: { params: { storeId: string } }) => {
    const billboards = await prisma.billboard.findMany({
        where:{
            id:params.storeId,
        },orderBy:{
        createdAt: 'desc'
        }
    })
    console.log("billboards",billboards)

    const formattedBilboards: BillboardColumn[] = billboards.map((item)=>({
        id:item.id,
        label:item.label,
        CreatedAt:format(item.createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillBoardClient Billboards={formattedBilboards} />
            </div>
        </div>
    );
}

export default BillBoardsPage
;