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
import ImageUpload from "@/components/ui/image-upload";
import { Image, Product } from "@prisma/client";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
  name: z.string().min(3, "Label must be at least 3 characters long"),
  Images: z.object({url:z.string()}).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValue = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product  & {
      images: Image[]
    } | null
}

const ProductForm = ({ initialData }: ProductFormProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const storeId = params.storeId;

  const title = initialData ? "Edit product" : "Create billboard";
  const description = initialData ? "Edit a product" : "Add a new product";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(initialData?.price?.toString())
    } :{
      name: "",
      Images: [],
      price: 0,
      categoryId: "",
      colorId: "",
      sizeId: "",
      isFeatured: false,
      isArchived: false,
    },
  });

  // Watch the ImageUrl field for debugging



  const onSubmit = async (data: ProductFormValue) => {
    try {
      console.log("📤 Submitting form data:", data);
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/${storeId}/products/${initialData.id}`, data);
        toast.success("Product updated!");
      } else {
        await axios.post(`/api/${storeId}/products`, data);
        toast.success("Product created!");
      }

      router.refresh();
      router.push(`/${storeId}/products`);
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
      await axios.delete(`/api/${storeId}/products/${initialData?.id}`);
      router.refresh();
      router.push(`/${storeId}/billboards`);
      toast.success("Product deleted.");
    } catch (err) {
      toast.error(
        "Make sure you removed all categories using this Product first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} loading={loading} onClose={()=>{setOpen(false)}} onConfirm={(()=>onDelete())} />
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
          {/* <FormField
            control={form.control}
            name="ImageUrl"
            render={({ field }) => {
              console.log(
                "🔍 FormField render - field.value:",
                `"${field.value}"`
              );
              console.log(
                "🔍 FormField render - field.value as array:",
                field.value ? [field.value] : []
              );

              return (
                <FormItem>
                  <FormLabel className="font-bold">Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => {
                        console.log(
                          "🔄 ImageUpload onChange called with:",
                          `"${url}"`
                        );
                        console.log(
                          "🔄 About to call field.onChange with:",
                          url
                        );
                        field.onChange(url);
                        console.log("✅ field.onChange called successfully");
                      }}
                      onRemove={() => {
                        console.log("🗑️ ImageUpload onRemove called");
                        console.log(
                          "🔄 About to call field.onChange with empty string"
                        );
                        field.onChange("");
                        console.log(
                          "✅ field.onChange called with empty string"
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          /> */}

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
                      placeholder="Product name"
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

export default ProductForm;
