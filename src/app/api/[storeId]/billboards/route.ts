import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prismadb";

export async function POST(req: NextRequest,{params}:{params:{storeId:string}}) {
  try {
    const { userId } = await auth();

    console.log(userId);

    const body = await req.json();

    const { label, ImageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!ImageUrl) {
      return new NextResponse("ImageUrl is required", { status: 400 });
    }

    if(!params.storeId){
        return new NextResponse("soter ID is required", { status: 400 });
    }

    const StoreByuserId = await prisma.store.findFirst({
        where:{
            id:params.storeId,
            userId
        }
    })

    if(!StoreByuserId){
        return new NextResponse("Non Unauthorized", { status: 403 });
    }

    const billboard = await prisma.billboard.create({
      data: {
        label,
        ImageUrl,
        storeId: params.storeId
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: NextRequest,{params}:{params:{storeId:string}}) {
  try {

    const storeId = await params.storeId

    if(!storeId){
        return new NextResponse("soter ID is required", { status: 400 });
    }

    const StoreByuserId = await prisma.store.findFirst({
        where:{
            id:storeId,
        }
    })

    if(!StoreByuserId){
        return new NextResponse("Non Unauthorized", { status: 403 });
    }

    const billboards = await prisma.billboard.findMany({
        where:{
            storeId:storeId
        }
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}