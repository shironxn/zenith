"use server";

import { NoteCreate, NoteQuery, NoteUpdate } from "@/lib/schema/note";
import { serverFetch } from "@/lib/api/server-client";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export const CreateNotes = async (data: NoteCreate) => {
  const { error } = await serverFetch("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (error) return error.message;
  revalidatePath("/");
};

export const GetNotes = async (query?: NoteQuery) => {
  const { data, error } = await serverFetch<any>("/notes", {
    params: {
      user_id: query?.user_id || undefined,
      visibility: query?.visibility || undefined,
      title: query?.search || undefined,
      page: query?.page || 1,
      limit: 6,
      order: "desc",
    },
    cache: "no-store",
  });

  if (error) return { error: error.message };
  return data;
};

export const GetNotesByID = async (id: string) => {
  const { data, error } = await serverFetch<any>(`/notes/${id}`, {
    cache: "no-store",
  });
  if (error?.message?.toLowerCase().includes("not found")) notFound();
  if (error) return { error: error.message };
  return data;
};

export const UpdateNotes = async (data: NoteUpdate, id: number) => {
  const { error } = await serverFetch(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (error) return error.message;
  revalidatePath("/");
};

export const DeleteNotes = async (id: string) => {
  const { error } = await serverFetch(`/notes/${id}`, {
    method: "DELETE",
  });
  if (error) return error.message;
  revalidatePath("/");
};
