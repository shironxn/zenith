"use client";

import { motion } from "framer-motion";
import { Note } from "@/lib/schema/note";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

function NoteThumbnail({ src, title }: { src?: string; title: string }) {
  const [isBroken, setIsBroken] = useState(false);
  const hasImage = Boolean(src) && !isBroken;

  if (!hasImage) {
    return (
      <div className="mb-4 flex aspect-[16/9] w-full items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
      <Image
        src={src as string}
        alt={title}
        fill
        className="object-cover"
        onError={() => setIsBroken(true)}
      />
    </div>
  );
}

export function NoteCard({ data }: { data: any }) {
  const notes: Note[] = data?.notes || [];

  if (notes.length === 0) {
    return (
      <div className="col-span-full py-20 text-center text-muted-foreground">
        No notes found.
      </div>
    );
  }

  return (
    <>
      {notes.map((note, i) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -4 }}
          className="group relative flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <Link href={`/note/${note.id}`} className="absolute inset-0 z-10" />
          <NoteThumbnail src={note.cover_url} title={note.title} />
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold tracking-tight">
            {note.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
            {note.description}
          </p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={note.author?.avatar_url || ""}
                  alt={note.author?.name || "User"}
                />
                <AvatarFallback>
                  {(note.author?.name || "U").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{note.author?.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(note.created_at).toLocaleDateString()}
            </span>
          </div>
        </motion.div>
      ))}
    </>
  );
}
