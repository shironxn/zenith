import { GetNotesByID } from "@/actions/note";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NoteMenu } from "@/components/note-drawer";
import { GetUserMe } from "@/actions/user";
import Image from "next/image";

export default async function Page({ params }: { params: { slug: string } }) {
  const note = await GetNotesByID(params.slug);
  const { data: me } = await GetUserMe();
  const isOwner = me?.id === note.author?.id;

  return (
    <article className="py-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {isOwner && (
            <Badge variant="secondary" className="capitalize">
              {note.visibility}
            </Badge>
          )}
          {isOwner && <NoteMenu note={note} />}
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-6">{note.title}</h1>
        <div className="flex items-center gap-4 py-4 border-y">
          <Avatar className="size-10">
            <AvatarImage src={note.author?.avatar_url} />
            <AvatarFallback>{note.author?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{note.author?.name}</p>
            <p className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          </div>
        </div>
      </header>

      {note.cover_url && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image src={note.cover_url} alt={note.title} fill className="object-cover" />
        </div>
      )}

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{note.content}</p>
      </div>
    </article>
  );
}
