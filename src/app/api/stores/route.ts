import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prismadb"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    console.log(userId)

    const body = await req.json()

    const { name } = body

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name) {
        return new NextResponse("Name is required", { status: 400 })
    }

    const store = await prisma.store.create({
        data: {
            name,
            userId,
        },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log("[STORES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 })
        }

        const stores = await prisma.store.findMany({
        where: {
            userId,
        },
        })

        return NextResponse.json(stores)
    } catch (error) {
        console.log("[STORES_GET]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
    }
