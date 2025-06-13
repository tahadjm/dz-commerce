import NavBar from "@/components/NavBar";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
    }:{
        children:React.ReactNode
        params:{ sotreId: string }}
) {
    const { userId } = await auth();
    if(!userId) {
        redirect('sign-in');
    }

    const store = await prisma.store.findFirst({
        where:{
            id:params.sotreId,
            userId
        }
    });


    if(!store){
        redirect('/');
    }
    return(
        <>
        <NavBar />
        {children}
        </>
    )
}