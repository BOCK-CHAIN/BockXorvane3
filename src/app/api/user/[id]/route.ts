import { auth } from '@/auth'
import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


// CHANGE: clerkid is changed to id.
export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const userProfile = await client.user.findUnique({
      where: {
        id: id,
      },
      include: {
        studio: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })
    if (userProfile)
      return NextResponse.json({ status: 200, user: userProfile })
    // const clerkUserInstance = await clerkClient.users.getUser(id)
    const session = await auth();
    const user = session?.user
    if(!user) return NextResponse.json({ status: 400 })
      // WIP: password is required

    let createUser;
    // const createUser = await client.user.create({
    //   data: {
    //     email: user.email,
    //     name: user.name,
    //     studio: {
    //       create: {},
    //     },
    //     workspace: {
    //       create: {
    //         name: `${user.name}'s Workspace`,
    //         type: 'PERSONAL',
    //       },
    //     },
    //     subscription: {
    //       create: {},
    //     },
    //   },
    //   include: {
    //     subscription: {
    //       select: {
    //         plan: true,
    //       },
    //     },
    //   },
    // })

    if (createUser) return NextResponse.json({ status: 201, user: createUser })

    return NextResponse.json({ status: 400 })
  } catch (error) {
    console.log('ERROR', error)
  }
}
