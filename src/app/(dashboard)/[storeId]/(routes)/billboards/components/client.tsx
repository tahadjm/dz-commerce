"use client";

import { Button } from "@/components/ui/button";
import Heading from "../../settings/components/Heading";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface BillboardClientProps{
    Billboards: BillboardColumn
}

export const BillBoardClient = ({Billboards}:BillboardClientProps) =>{
    console.log(Billboards)
    const router = useRouter()
    const params =useParams()
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading title={`Billboards ${Billboards?.length}`} description="Manage Billboards of your store" />
            <Button onClick={()=> router.push(`/${params.storeId}/billboards/new`)}>
                <PlusIcon className="mr-2 h-4 w-4"  />
                Add new
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="label" columns={columns} data={Billboards} />
        <Heading title="API" description="API Call for billboards" /> 
        <Separator />
        <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
    )
}