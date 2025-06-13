import prisma from "@/lib/prismadb";
import ColorForm from "../components/ColorForm";

const SizePage = async ({params}:{params:{colorId:string,storeId:string}}) => {
    const colorId = await params.colorId
    const storeId = await params.storeId
    let color
    if(colorId){
        color = await prisma.color.findUnique({
            where:{
                id:colorId,
                storeId
            }
        })
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={color} />
            </div>
        </div>
    );
}

export default SizePage;