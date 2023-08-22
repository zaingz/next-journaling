import EntryCard from "@/components/EntryCard";
import NewEntry from "@/components/NewEntry";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getUserJournalEntries = async () => {
    const user = await getUserByClerkId({select: {id: true}})
    return prisma.journalEntry.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export default async function JournalPage() {
    const userJournalEntries = await getUserJournalEntries()
    return (
        <div className="px-6 py-8 bg-zinc-100/50 h-full">
          <h1 className="text-4xl mb-12">Journals</h1>
          <div className="my-8">
          </div>
          <div className="grid grid-cols-3 gap-4">
            <NewEntry />
            {userJournalEntries.map((entry) => (
                <EntryCard key = {entry.id} entry={entry}/>
            ))}
          </div>
        </div>
      )
  }
  