import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const createNewUser = async () => {
  const match = await getUserByClerkId({ select: { id: true } })

  if (!match) {
    const user = await currentUser()
    await prisma.user.create({
      data: {
        clerkId: user?.id as string,
        email: user?.emailAddresses[0].emailAddress as string,
      },
    })
  }
}

export default async function NewUserPage() {
  await createNewUser()
  redirect('/journal')
}
