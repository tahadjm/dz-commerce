import prisma from "@/lib/prismadb";
import SizeForm from "../components/SizeForm";

const SizePage = async ({params}:{params:{sizeId:string,storeId:string}}) => {
    const sizeId = await params.sizeId
    const storeId = await params.storeId
    let size
    if(sizeId){
        size = await prisma.size.findUnique({
            where:{
                id:sizeId,
                storeId
            }
        })
    }
    console.log(size)

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm initialData={size} />
            </div>
        </div>
    );
}

export default SizePage;