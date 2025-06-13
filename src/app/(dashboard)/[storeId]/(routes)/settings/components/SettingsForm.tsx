"use client"

import { Store } from "@prisma/client";
import Heading from "./Heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import useOrign from "@/hooks/use-origin";

interface SettingsFormProps{
    ititialData:Store
}

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long")
})

type SettingsFormValue = z.infer<typeof formSchema>


const SettingsForm =  ({ ititialData }: SettingsFormProps) => {

    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const storeId = params.storeId;
    const origin = useOrign();

    const form = useForm<SettingsFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: ititialData
    });

    const onSubmit = async (data: SettingsFormValue) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${storeId}`, data);
            router.refresh();
            toast.success("Store updated.");
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    const onDelete = async () =>{
        try{
            setLoading(true);
            await axios.delete(`/api/stores/${storeId}`)
            router.refresh();
            router.push("/");
            toast.success("Store Deleted successfully.")
        }catch(err){
            toast.error("Make Sure you removed all products and categories first. ")
        }finally{
            setLoading(false)
            setOpen(false);
        }
    }
    return (
        <>
            <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between" >
                <Heading title="Settings" description="Managing Store Referces" />
                <Button variant={"destructive"} size={"sm"} disabled={loading} onClick={() => { setOpen(true) }} >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full"  >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold" >Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="store name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">Save changes</Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${storeId}`} variant="public" />
        </>
    );
}

export default SettingsForm;