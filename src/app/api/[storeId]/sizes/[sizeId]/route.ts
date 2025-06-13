import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("size ID is required", { status: 400 });
    }

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json({ size });
  } catch (err) {
    console.log("[size_GET]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    const storeId = await params.storeId;
    const sizeId = await params.sizeId
    if(!sizeId){
      return new NextResponse("size ID is required.", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthentificated."), { status: 401 };
    }
    if (!name) {
      return new NextResponse("name is required.", { status: 400 });
    }
    if (!value) {
      return new NextResponse("value is required.", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }
    const StoreByuserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!StoreByuserId) {
      return new NextResponse("Non Unauthorized", { status: 403 });
    }
    const Updatedsize = await prisma.size.update({
      where: {
        id: sizeId,
        storeId: storeId,
      },
      data: {
        value,
        name
      },
    });

    return NextResponse.json({ Updatedsize });
  } catch (err) {
    console.log("[size_PATCH]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
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

    if (!params.sizeId) {
      return new NextResponse("size ID is required", { status: 400 });
    }

    const size = await prisma.size.delete({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ size });
  } catch (err) {
    console.log("[size_DELETE]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
