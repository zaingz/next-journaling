import Editor from '@/components/Editor'
import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'

type EntryPageProps = {
  params: {
    id: string
  }
}

const getEntry = async (id: string) => {
  const user = await getUserByClerkId({ select: { id: true } })
  return await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
     
    },
    include: {
        analysis: true,
      },
  })
}

export default async function EntryPage({ params }: EntryPageProps) {
  const entry = await getEntry(params.id)
  console.log(entry)
  const { mood, summary, color, subject, negative } = entry?.analysis
  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' },
  ]
  return (
    <div className="h-full w-full ">
      <Editor entry={entry} />
    </div>
  )
}
