import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prismadb";

export async function POST(req: NextRequest,{params}:{params:{storeId:string}}) {
  try {
    const { userId } = await auth();

    const body = await req.json();

    const { name, price,colorId, categoryId, sizeId, isFeatured, isArchived, Images} = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("price is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("colorId is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("categoryId is required", { status: 400 });
    }

    if (!Images) {
      return new NextResponse("Images is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("sizeId is required", { status: 400 });
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

    const billboard = await prisma.product.create({
      data: {
            name,
            colorId,
            sizeId,
            categoryId,
            price,
            isArchived,
            isFeatured,
            storeId: params.storeId,
            Images: {
              create: Images?.map((image: { url: string }) => ({
                url: image.url,
              })),
            },
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

    const products = await prisma.product.findMany({
        where:{
            storeId:storeId
        }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}