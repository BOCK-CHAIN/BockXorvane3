import React from 'react'
import { getNotifications, onAuthenticateUser } from '@/actions/user'
import {
  getWorkSpaces,
  verifyAccessToWorkspace,
} from '@/actions/workspace'
import { redirect } from 'next/navigation'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Sidebar from '@/components/global/sidebar'
import GlobalHeader from '@/components/global/global-header'
import { Subscription } from '@prisma/client'

type Props = {
  params: { workspaceId: string }
  children: React.ReactNode
}

const Layout = async ({ params: { workspaceId }, children }: Props) => {
  const auth = await onAuthenticateUser()

  if (!auth.user?.workspace || !auth.user.workspace.length) {
    redirect('/auth/sign-in')
  }

  const hasAccess = await verifyAccessToWorkspace(workspaceId)

  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user.workspace[0].id}`)
  }

  if (!hasAccess.data?.workspace) return null

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: getWorkSpaces,
  })

  await queryClient.prefetchQuery({
    queryKey: ['user-notifications'],
    queryFn: getNotifications,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} subscription={auth.user.subscription as Subscription} />
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden ">
          {children}
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout
