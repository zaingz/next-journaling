import { auth } from '@clerk/nextjs'
import { prisma } from './db'

export const getUserByClerkId = async ({ select={id: true} }) => {
  const { userId } = await auth()
  return prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
    select,
  })
}
