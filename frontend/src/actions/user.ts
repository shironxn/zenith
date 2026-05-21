"use server";

import { serverFetch } from "@/lib/api/server-client";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export const GetUserMe = async () => {
  const { data, error } = await serverFetch<any>("/users/me", {
    cache: "no-store",
  });
  if (error) return { error: error.message };
  return { data };
};

export const GetUserByName = async (name: string) => {
  const { data, error } = await serverFetch<any>("/users", {
    params: { name, details: "true" },
    cache: "no-store",
  });

  if (error || !data?.users?.length) notFound();
  return data.users[0];
};

export const GetUserByID = async (id: string) => {
  const { data, error } = await serverFetch<any>(`/users/${id}`, {
    cache: "no-store",
  });
  if (error) return { error: error.message };
  return { data };
};

export const UpdateUser = async (id: string, data: any) => {
  const { error } = await serverFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (error) return error.message;
  revalidatePath("/profile");
};

export const DeleteUser = async (id: string) => {
  const { error } = await serverFetch(`/users/${id}`, {
    method: "DELETE",
  });
  if (error) return error.message;
  revalidatePath("/");
};
