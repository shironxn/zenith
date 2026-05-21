import { NoteCard } from "@/components/note/note-card";
import { GetNotes } from "@/actions/note";
import { NotePagination } from "@/components/note/note-pagination";

export default async function Page({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string };
}) {
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;
  const notes = await GetNotes({
    page: page,
    search: search,
    visibility: "public",
  });

  return (
    <main className="py-10">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Discover Notes</h1>
        <p className="text-muted-foreground text-lg">Explore public thoughts and ideas.</p>
      </section>
      
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
