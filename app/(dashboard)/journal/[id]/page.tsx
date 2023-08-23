import Editor from "@/components/Editor";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

type EntryPageProps = {
    params: {
      id: string;
    };
  };

  const getEntry = async (id: string) => {
    const user = await getUserByClerkId({select: {id: true}})
    return await prisma.journalEntry.findUnique({
        where: {
          userId_id: {
            userId: user.id,
            id,
          },
        },
      })
  }

export default async function EntryPage({ params }: EntryPageProps) {
    const entry = await getEntry(params.id)
  return (
    <div className="h-full w-full">
      <Editor entry={entry} />
    </div>
  )
  }
  