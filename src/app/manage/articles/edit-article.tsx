"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { Editor } from "@tinymce/tinymce-react";
export default function EditArticle({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const manageAccountT = useTranslations("ManageAccount");
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent className="sm:max-w-[1200px] h-[700px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
          <DialogDescription>Edit Article Of System</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-employee-form"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 items-center justify-items-start gap-4">
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium w-20"
                      >
                        {" "}
                        Title
                      </Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="title" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => {
                  const editorRef = useRef<any>(null);

                  return (
                    <FormItem>
                      <div className="grid grid-cols-2 items-center justify-items-start gap-4">
                        <Label
                          htmlFor="content"
                          className="text-sm font-medium w-20"
                        >
                          Content
                        </Label>
                        <div className="col-span-3 w-full space-y-2 ">
                          <Editor
                            apiKey="2ago0pjy5jsyi0eajfrx6ftefx6f8u2zvv2uubbi0m3dp3xo" // Thay bằng API Key của TinyMCE nếu cần
                            onInit={(evt, editor) =>
                              (editorRef.current = editor)
                            }
                            value={field.value}
                            onEditorChange={(content) =>
                              field.onChange(content)
                            }
                            init={{
                              height: 500,
                              menubar: true,
                              plugins: [
                                "advlist autolink lists link image charmap print preview anchor",
                                "searchreplace visualblocks code fullscreen",
                                "insertdatetime media table paste code help wordcount",
                              ],
                              toolbar:
                                "undo redo | formatselect | bold italic backcolor | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | removeformat | help",
                              content_style:
                                "body { font-family:Arial,sans-serif; font-size:14px }",
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-employee-form">
            {manageAccountT("Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
