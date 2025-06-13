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
import { Billboard } from "@prisma/client";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
  label: z.string().min(3, "Label must be at least 3 characters long"),
  ImageUrl: z.string().min(1, "Image URL is required"),
});

type BillBoardFormValue = z.infer<typeof formSchema>;

interface BillBoardFormProps {
  initialData: Billboard;
}

const BillBoardForm = ({ initialData }: BillBoardFormProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const storeId = params.storeId;

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillBoardFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      label: "",
      ImageUrl: "",
    },
  });

  // Watch the ImageUrl field for debugging
  const watchedImageUrl = form.watch("ImageUrl");
  console.log("📋 Current form ImageUrl:", `"${watchedImageUrl}"`); // Added quotes to see empty strings

  const onSubmit = async (data: BillBoardFormValue) => {
    try {
      console.log("📤 Submitting form data:", data);
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/${storeId}/billboards/${initialData.id}`, data);
        toast.success("Billboard updated!");
      } else {
        await axios.post(`/api/${storeId}/billboards`, data);
        toast.success("Billboard created!");
      }

      router.refresh();
      router.push(`/${storeId}/billboards`);
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
      await axios.delete(`/api/${storeId}/billboards/${initialData?.id}`);
      router.refresh();
      router.push(`/${storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (err) {
      toast.error(
        "Make sure you removed all categories using this billboard first."
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
          <FormField
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
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
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

export default BillBoardForm;
