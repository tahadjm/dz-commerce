"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Size } from "@prisma/client";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  value: z.string().min(1, "Value is required"),
});

type SizeFormValue = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size;
}

const SizeForm = ({ initialData }: SizeFormProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const storeId = params.storeId;

  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData ? "Edit a Size" : "Add a new Size";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: SizeFormValue) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/${storeId}/sizes/${initialData.id}`, data);
        toast.success("Size updated!");
      } else {
        await axios.post(`/api/${storeId}/sizes`, data);
        toast.success("Size created!");
      }

      router.refresh();
      router.push(`/${storeId}/sizes`);
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/sizes/${initialData?.id}`);
      router.refresh();
      router.push(`/${storeId}/sizes`);
      toast.success("Size deleted.");
    } catch (err) {
      toast.error(
        "Make sure you removed all categories using this Size first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={() => onDelete()}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Value name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
