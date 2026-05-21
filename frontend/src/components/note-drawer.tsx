"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/loading-button";
import { useForm } from "react-hook-form";
import {
  Note,
  NoteCreate,
  noteCreateSchema,
  noteUpdateSchema,
  NoteUpdate,
} from "@/lib/schema/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { CreateNotes, UpdateNotes, DeleteNotes } from "@/actions/note";
import { useRouter } from "next/navigation";

type NameOptions =
  | "title"
  | "description"
  | "cover_url"
  | "content"
  | "visibility";
const inputList: { name: NameOptions; label: string; placeholder: string; maxLength?: number }[] = [
  { name: "title", label: "Title", placeholder: "Title", maxLength: 25 },
  { name: "description", label: "Description", placeholder: "Description", maxLength: 50 },
  { name: "cover_url", label: "Cover URL", placeholder: "Cover URL" },
  { name: "visibility", label: "Visibility", placeholder: "Visibility" },
];

export const NoteCreateDialog = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Note</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Note</DialogTitle>
          </DialogHeader>
          <NoteForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Create Note</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Note</DrawerTitle>
        </DrawerHeader>
        <NoteForm className="px-4" onSuccess={() => setOpen(false)} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const NoteUpdateDialog = ({ note }: { note: Note }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>Edit Note</DialogTitle>
      </DialogHeader>
      <NoteForm note={note} onSuccess={() => setOpen(false)} />
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start font-normal">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">{content}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full justify-start font-normal">Edit</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-4 pb-4">{content}</div>
      </DrawerContent>
    </Drawer>
  );
};

function NoteForm({ className, note, onSuccess }: { className?: string; note?: Note; onSuccess: () => void }) {
  const router = useRouter();
  const form = useForm<NoteCreate | NoteUpdate>({
    resolver: zodResolver(!note ? noteCreateSchema : noteUpdateSchema),
    defaultValues: note ? {
      title: note.title,
      description: note.description,
      content: note.content,
      cover_url: note.cover_url,
      visibility: note.visibility,
    } : { visibility: "public" }
  });

  const onSubmit = async (data: NoteCreate | NoteUpdate) => {
    const error = note 
      ? await UpdateNotes(data as NoteUpdate, note.id)
      : await CreateNotes(data as NoteCreate);

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: note ? "Note updated" : "Note created" });
      onSuccess();
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-4", className)}>
        {inputList.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  {item.name === "visibility" ? (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={item.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input placeholder={item.placeholder} maxLength={item.maxLength} {...field} />
                  )}
                </FormControl>
                {item.maxLength ? (
                  <FormDescription className="text-right text-xs">
                    {(String(field.value || "").length || 0)}/{item.maxLength}
                  </FormDescription>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Content..." maxLength={5000} {...field} />
              </FormControl>
              <FormDescription className="text-right text-xs">
                {(String(field.value || "").length || 0)}/5000
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" loading={form.formState.isSubmitting}>
          {note ? "Update" : "Create"}
        </LoadingButton>
      </form>
    </Form>
  );
}

export const NoteDeleteAlert = ({ note }: { note: Note }) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onDelete = async () => {
    setLoading(true);
    const error = await DeleteNotes(note.id.toString());
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Note removed" });
      router.refresh();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start font-normal text-destructive hover:text-destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const NoteMenu = ({ note }: { note: Note }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <span className="sr-only">Open menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <NoteUpdateDialog note={note} />
      <NoteDeleteAlert note={note} />
    </DropdownMenuContent>
  </DropdownMenu>
);
