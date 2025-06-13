"use client";

import { Button } from "@/components/ui/button";
import Heading from "../../settings/components/Heading";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { CategoriesColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface CategoriesCilentProps{
    Categories: CategoriesColumn
}

export const CategoriesCilent = ({Categories}:CategoriesCilentProps) =>{
    const router = useRouter()
    const params =useParams()
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading title={`Categoreis ${Categories?.length}`} description="Manage Categories of your store" />
            <Button onClick={()=> router.push(`/${params.storeId}/categories/new`)}>
                <PlusIcon className="mr-2 h-4 w-4"  />
                Add new
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={Categories} />
        <Heading title="API" description="API Call for categories" /> 
        <Separator />
        <ApiList entityName="category" entityIdName="categories" />
        </>
    )
}