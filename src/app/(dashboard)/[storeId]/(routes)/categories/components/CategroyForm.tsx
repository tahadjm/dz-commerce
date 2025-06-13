"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Billboard, Category } from "@prisma/client";
import AlertModal from "@/components/modals/alert-modal";
import prisma from "@/lib/prismadb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  billboardId: z
    .string()
    .min(3, "billboardId must be at least 3 characters long"),
});

type CategoriesFormValue = z.infer<typeof formSchema>;

interface CategoriesFormProps {
  initialData: Category;
}

const CategoriesForm = ({ initialData }: CategoriesFormProps) => {
  const [open, setOpen] = useState(false);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const storeId = params.storeId;

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoriesFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      name: "",
      billboardId: "",
    },
  });

  useEffect(() => {
    const StoreBillboards = async () => {
      try {
        const response = await axios.get(`/api/${params.storeId}/billboards`);
        if (Array.isArray(response.data) && response.data.length >= 1) {
          setBillboards(response.data);
        } else {
          setBillboards([]);
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    };
    StoreBillboards();
  }, [params.storeId]);

  const onSubmit = async (data: CategoriesFormValue) => {
    try {
      console.log("📤 Submitting form data:", data);
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/${storeId}/categories/${initialData.id}`, data);
        toast.success("category updated!");
      } else {
        await axios.post(`/api/${storeId}/categories`, data);
        toast.success("category created!");
      }

      router.refresh();
      router.push(`/${storeId}/categories`);
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
      await axios.delete(`/api/${storeId}/categories/${initialData?.id}`);
      router.refresh();
      router.push(`/${storeId}/categories`);
      toast.success("category deleted.");
    } catch (err) {
      toast.error(
        "Make sure you removed all categories using this category first."
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
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Billboard Label</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        {field.value
                          ? billboards.find((b) => b.id === field.value)
                              ?.label ?? "Select billboard"
                          : "Select billboard"}
                      </SelectTrigger>
                      <SelectContent>
                        {billboards.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default CategoriesForm;
