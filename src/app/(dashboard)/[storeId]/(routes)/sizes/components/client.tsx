"use client";

import { Button } from "@/components/ui/button";
import Heading from "../../settings/components/Heading";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { columns, SizeColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface SizePageProps{
    Sizes: SizeColumn
}

export const SizeClient = ({Sizes}:SizePageProps) =>{
    const router = useRouter()
    const params =useParams()
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading title={`Sizes ${Sizes?.length}`} description="Manage Sizes of your store" />
            <Button onClick={()=> router.push(`/${params.storeId}/sizes/new`)}>
                <PlusIcon className="mr-2 h-4 w-4"  />
                Add new
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={Sizes} />
        <Heading title="API" description="API Call for sizes" /> 
        <Separator />
        <ApiList entityName="sizes" entityIdName="SizeId" />
        </>
    )
}