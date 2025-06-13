"use client"

import { Store } from "@prisma/client";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { UseStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon} from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { CommandInput } from "cmdk";
import { Value } from '../../prisma/src/generated/prisma/runtime/library';
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface StoreSwitcherProps extends PopoverTriggerProps{
    items:[Store];
}

const StoreSwitcher = ({
    className,
    items= []
}:StoreSwitcherProps) => {
    const storeModal = UseStoreModal();
    const params = useParams();
    const router = useRouter();
    const storeId = params.storeId


    const formattedItems = items.map((item)=>({
        label:item.name,
        value:item.id
    }))

    const currentStore = formattedItems.find((item) => item.value === storeId);

    const [open,setOpen] = useState(false)

    const onStoreSelect = (store: { value: string, label:string }) =>{
        setOpen(false)
        router.push(`/${store.value}`)
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} size={"sm"} role="comobox" aria-expanded={open} aria-label="Select a Store" className={cn("w-[200px] justify-between", className)} >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search a store" />
                    <CommandList>
                        <CommandEmpty>No Store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store)=>(
                                <CommandItem className="text-sm"  onSelect={()=> onStoreSelect(store)} key={store.value}>
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    {store.label}
                                    <Check className={cn("ml-auto h-4 w-4",currentStore?.value === store.value ? "opacity-100":"opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={()=>{setOpen(false); storeModal.onOpen()}}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default StoreSwitcher;