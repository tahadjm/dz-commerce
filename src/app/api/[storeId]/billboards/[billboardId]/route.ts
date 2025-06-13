import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("billboard Id is required", { status: 400 });
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
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
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, ImageUrl } = body;
    const storeId = params.storeId;
    if (!userId) {
      return new NextResponse("Unauthentificated."), { status: 401 };
    }
    if (!label) {
      return new NextResponse("label is required.", { status: 400 });
    }
    if (!ImageUrl) {
      return new NextResponse("ImageUrl is required.", { status: 400 });
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
    const billboard = await prisma.billboard.update({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
      data: {
        ImageUrl,
        label,
      },
    });

    return NextResponse.json({ billboard });
  } catch (err) {
    console.log("[BILLBOARD_PATCH]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
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

    if (!params.billboardId) {
      return new NextResponse("billboard Id is required", { status: 400 });
    }

    const billboard = await prisma.billboard.delete({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ billboard });
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
