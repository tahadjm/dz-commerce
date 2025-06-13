import prisma from "@/lib/prismadb";
import { ColorClient } from "./components/client";
import {format} from "date-fns"
import { ColorColumn } from "./components/columns";


const ColorPage = async ({ params }: { params: { storeId: string } }) => {
    const storeId = await params.storeId;
    const color = await prisma.color.findMany({
        where:{
            storeId:storeId,
        },orderBy:{
        createdAt: 'desc'
        }
    })

    const formattedBilboards: ColorColumn[] = color.map((item)=>({
        id:item.id,
        name:item.name,
        value:item.value,
        CreatedAt:format(item.createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorClient colors={formattedBilboards} />
            </div>
        </div>
    );
}

export default ColorPage;
;