"use client";

import { Button } from "@/components/ui/button";
import Heading from "../../settings/components/Heading";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface ColorPageProps{
    colors: ColorColumn[]
}

export const ColorClient = ({colors}:ColorPageProps) =>{
    const router = useRouter()
    const params =useParams()
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading title={`Colors ${colors?.length}`} description="Manage Colors of your store" />
            <Button onClick={()=> router.push(`/${params.storeId}/colors/new`)}>
                <PlusIcon className="mr-2 h-4 w-4"  />
                Add new
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={colors} />
        <Heading title="API" description="API Call for colors" /> 
        <Separator />
        <ApiList entityName="colors" entityIdName="ColorId" />
        </>
    )
}