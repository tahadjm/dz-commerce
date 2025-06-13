import prisma from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import {format} from "date-fns"
import { formatter } from "@/utils/clipboard";
import { ProductColumn } from "./components/columns";


const ProductPage = async ({ params }: { params: { storeId: string } }) => {
    const products = await prisma.product.findMany({
        where:{
            id:params.storeId,
        },orderBy:{
        createdAt: 'desc'
        },include:{
            Size:true,
            Category:true,
            Color:true
        }
    })
    console.log("billboards",products)

    const formattesproducts: ProductColumn[] = products.map((item)=>({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.Category. name,
        size: item.Size.name,
        color :item.Color.name,
        CreatedAt: format(item.createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient products={formattesproducts} />
            </div>
        </div>
    );
}

export default ProductPage
;