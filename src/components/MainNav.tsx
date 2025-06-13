"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MainNav = ({
    className,
    ...props
}:React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname()
    const params = useParams();
    const storeId = params.storeId
    const router = [
    {
        href: `/${storeId}`,
        label: "Overiew",
        active: pathname === `/${storeId}/overiew`
    },
    {
        href: `/${storeId}/billboards`,
        label: "Billboard",
        active: pathname === `/${storeId}/billboards`
    },
    {
        href: `/${storeId}/categories`,
        label: "Categories",
        active: pathname === `/${storeId}/categories`
    },
    {
        href: `/${storeId}/sizes`,
        label: "Sizes",
        active: pathname === `/${storeId}/sizes`
    },
    {
        href: `/${storeId}/products`,
        label: "Products",
        active: pathname === `/${storeId}/products`
    },
    {
        href: `/${storeId}/settings`,
        label: "Settings",
        active: pathname === `/${storeId}/settings`
    },
]
    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6 ", className)}>
            {router.map(
                (route) =>(
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn("text-sm font-medium transition-colors hover:text-primary ",
                            route.active ? "text-black dark:text-white" : "text-muted-foreground"
                        )}
                    >
                        {route.label}
                    </Link>
                )
            )}
        </nav>
    );
}

export default MainNav;