import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SettingsForm from "./components/SettingsForm";

interface SettingsPageprops{
    params:{
        storeId:string
    }
}

const SettingsPage = async ({params}:SettingsPageprops) => {
    const {userId} = await auth();
    const storeId = await params.storeId;
    if(!userId){
        redirect("/sign-in")
    }
    const store = await prisma.store.findFirst({
        where:{
            id:storeId,
            userId,
        }
    })
    if(!store){
        redirect("/");
    }
    console.log(store)
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm ititialData={store} />
            </div>
        </div>
    );
}

export default SettingsPage;