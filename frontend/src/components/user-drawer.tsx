"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, UserRequest, userRequestSchema } from "@/lib/schema/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenBox } from "lucide-react";
import { toast } from "./ui/use-toast";
import { LoadingButton } from "./loading-button";
import { UpdateUser } from "@/actions/user";
import { useRouter } from "next/navigation";

const inputList: { name: keyof UserRequest; label: string; placeholder: string; maxLength?: number }[] = [
  { name: "name", label: "Name", placeholder: "Name", maxLength: 20 },
  { name: "email", label: "Email", placeholder: "Email" },
  { name: "bio", label: "Bio", placeholder: "Bio", maxLength: 50 },
  { name: "avatar_url", label: "Avatar URL", placeholder: "Avatar URL" },
  { name: "password", label: "Password", placeholder: "New password (optional)", maxLength: 100 },
];

export const UserUpdateDrawer = ({ user }: { user: User }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Update your profile details.</DialogDescription>
      </DialogHeader>
      <ProfileForm user={user} onSuccess={() => setOpen(false)} />
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon"><PenBox className="size-4" /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">{content}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon"><PenBox className="size-4" /></Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-4 pb-4">{content}</div>
      </DrawerContent>
    </Drawer>
  );
};

function ProfileForm({ className, user, onSuccess }: { className?: string; user: User; onSuccess: () => void }) {
  const router = useRouter();
  const form = useForm<UserRequest>({
    resolver: zodResolver(userRequestSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar_url: user.avatar_url,
    },
  });

  const onSubmit = async (data: UserRequest) => {
    const error = await UpdateUser(user.id.toString(), data);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Profile updated" });
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
                  <Input
                    placeholder={item.placeholder}
                    maxLength={item.maxLength}
                    {...field}
                    type={item.name === "password" ? "password" : "text"}
                  />
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
        <LoadingButton type="submit" loading={form.formState.isSubmitting}>
          Save Changes
        </LoadingButton>
      </form>
    </Form>
  );
}
