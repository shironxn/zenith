import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserUpdateDrawer } from "@/components/user-drawer";
import { GetUserMe } from "@/actions/user";
import { GetNotes } from "@/actions/note";
import { NoteCard } from "@/components/note/note-card";
import { NotePagination } from "@/components/note/note-pagination";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string };
}) {
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;

  const { data: user, error } = await GetUserMe();
  if (error || !user) redirect("/login");

  const notes = await GetNotes({
    search: search,
    user_id: user.id,
    page: page,
  });

  return (
    <main className="py-10">
      <section className="mb-12 flex flex-col items-center text-center">
        <Avatar className="size-32 mb-6 border-4 border-background shadow-xl">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback className="text-2xl">{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{user.name}</h1>
        <p className="text-muted-foreground max-w-md mb-6">{user.bio || "No bio yet."}</p>
        <UserUpdateDrawer user={user} />
      </section>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">My Notes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NoteCard data={notes} />
      </div>

      {Number(notes?.metadata?.total_pages) > 1 && (
        <div className="mt-12 flex justify-center">
          <NotePagination
            currentPage={notes.metadata.page}
            totalPages={Number(notes?.metadata?.total_pages)}
          />
        </div>
      )}
    </main>
  );
}
