import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("categoryId Id is required", { status: 400 });
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json({ billboard });
  } catch (err) {
    console.log("[BILLBOARD_GET]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = body;
    const storeId = params.storeId;
    if (!userId) {
      return new NextResponse("Unauthentificated."), { status: 401 };
    }
    if (!name) {
      return new NextResponse("Name is required.", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard ID is required.", { status: 400 });
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
    const category = await prisma.category.update({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json({ category });
  } catch (err) {
    console.log("[CATEGORY_PATCH]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
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

    if (!params.categoryId) {
      return new NextResponse("category ID Id is required", { status: 400 });
    }

    const category = await prisma.category.delete({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ category });
  } catch (err) {
    console.log("[CATEGORY_DELETE]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
