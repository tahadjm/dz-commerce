import { UserButton } from "@clerk/nextjs";
import MainNav from "./MainNav";
import StoreSwitcher from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prismadb";

const NavBar = async () => {
    const {userId} = await auth();

    if(!userId){
        redirect("sign-in");
        return null;
    }

    const stores = await prisma.store.findMany({
        where:{
            userId
        }
    });
    return (
        <div className="border-b ">
            <div className="flex h-16 items-center px-4 ">
                <StoreSwitcher items={stores} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSwitchSessionUrl="/" />
                </div>
            </div>
        </div>
    );
}

export default NavBar;