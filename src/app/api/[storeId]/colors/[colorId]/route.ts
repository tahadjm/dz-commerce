import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("color ID is required", { status: 400 });
    }

    const color = await prisma.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json({ color });
  } catch (err) {
    console.log("[COLOR_GET]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    const storeId = await params.storeId;
    const colorId = await params.colorId
    if(!colorId){
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
    const Updatedcolor = await prisma.color.update({
      where: {
        id: colorId,
        storeId: storeId,
      },
      data: {
        value,
        name
      },
    });

    return NextResponse.json({ Updatedcolor });
  } catch (err) {
    console.log("[COLOR_PATCH]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
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

    if (!params.colorId) {
      return new NextResponse("color ID is required", { status: 400 });
    }

    const color = await prisma.color.delete({
      where: {
        id: params.colorId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ color });
  } catch (err) {
    console.log("[COLOR_DELETE]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
