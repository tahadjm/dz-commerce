"use client";

import { Button } from "@/components/ui/button";
import Heading from "../../settings/components/Heading";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface BillboardClientProps{
    Products: ProductColumn[]
}

export const ProductClient = ({Products}:BillboardClientProps) =>{
    const router = useRouter()
    const params =useParams()
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading title={`Products ${Products?.length}`} description="Manage Products of your store" />
            <Button onClick={()=> router.push(`/${params.storeId}/products/new`)}>
                <PlusIcon className="mr-2 h-4 w-4"  />
                Add new
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={Products || []} />
        <Heading title="API" description="API Call for products" /> 
        <Separator />
        <ApiList entityName="products" entityIdName="productsId" />
        </>
    )
}