import prisma from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import {format} from "date-fns"
import { SizeColumn } from "./components/columns";


const SizePage = async ({ params }: { params: { storeId: string } }) => {
    const storeId = await params.storeId;
    const size = await prisma.size.findMany({
        where:{
            storeId:storeId,
        },orderBy:{
        createdAt: 'desc'
        }
    })

    const formattedBilboards: SizeColumn[] = size.map((item)=>({
        id:item.id,
        name:item.name,
        value:item.value,
        CreatedAt:format(item.createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient Sizes={formattedBilboards} />
            </div>
        </div>
    );
}

export default SizePage;
;