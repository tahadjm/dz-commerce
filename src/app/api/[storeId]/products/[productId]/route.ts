import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("productId Id is required", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.log("[BILLBOARD_GET]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth();

    const body = await req.json();

    const { name, price,colorId, categoryId, sizeId, isFeatured, isArchived, Images} = body;

    const storeId = await params.storeId

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

    if(!storeId){
        return new NextResponse("soter ID is required", { status: 400 });
    }

    const StoreByuserId = await prisma.store.findFirst({
        where:{
            id:storeId,
            userId
        }
    })

    if(!StoreByuserId){
        return new NextResponse("Non Unauthorized", { status: 403 });
    }

    const billboard = await prisma.product.update({
      where: {
        id: params.productId,
      },
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
  }catch (err) {
    console.log("[BILLBOARD_PATCH]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = await auth();
    const storeId = params.storeId;
    if (!userId) {
      return new NextResponse("Unauthentificated."), { status: 401 };
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const StoreByuserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!StoreByuserId) {
      return new NextResponse("Non Unauthorized", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("billboard Id is required", { status: 400 });
    }

    const product = await prisma.product.delete({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
