import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string}}
) {
    try {
        const {userId} =await auth();
        const body = await req.json();
        const {name}= body
        const storeId = params.storeId;
        if(!userId){
            return new NextResponse("Unauthentificated."),{status:401}
        }
        if(!name){
            return new NextResponse("Name is required.",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is required",{status:400})
        }

        const store = await prisma.store.update({
            where:{
                id:storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json({store})

    } catch (err) {
        console.log("[STORE_PATCH]",err)
        return new NextResponse("internal error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string}}
) {
    try {
        const {userId} =await auth();
        const storeId = params.storeId;
        if(!userId){
            return new NextResponse("Unauthentificated."),{status:401}
        }

        if(!storeId){
            return new NextResponse("Store Id is required",{status:400})
        }

        const store = await prisma.store.delete({
            where:{
                id:storeId,
                userId
            }
        })

        return NextResponse.json({store})

    } catch (err) {
        console.log("[STORE_DELETE]",err)
        return new NextResponse("internal error",{status:500})
    }
}