"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { useForm } from "react-hook-form";
import { AuthLogin, authLoginSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { Login } from "@/actions/auth";

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<AuthLogin>({
    resolver: zodResolver(authLoginSchema),
  });

  const onSubmit = async (data: AuthLogin) => {
    const error = await Login(data);
    if (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error,
      });
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-x-2">
                <FormLabel>Email</FormLabel>
                <FormMessage className="text-xs" />
              </div>
              <FormControl>
                <Input required type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-x-2">
                <FormLabel>Password</FormLabel>
                <FormMessage className="text-xs" />
              </div>
              <FormControl>
                <PasswordInput required maxLength={100} {...field} />
              </FormControl>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <FormDescription>{(field.value?.length || 0)}/100</FormDescription>
                <FormDescription className="cursor-pointer">Forgot password?</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <LoadingButton
          loading={form.formState.isSubmitting}
          type="submit"
          className="w-full mt-3"
        >
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
};

export { LoginForm };
