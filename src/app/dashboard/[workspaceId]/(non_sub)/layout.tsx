import { verifyAccessToWorkspace } from '@/actions/workspace'
import GlobalHeader from '@/components/global/global-header'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: { workspaceId: string }
    children: React.ReactNode
}

export default async function layout({ params, children }: Props) {
    const hasAccess = await verifyAccessToWorkspace(params.workspaceId)
    if (hasAccess.status !== 200) {
        redirect(`/dashboard/${params.workspaceId}`)
    }

    if (!hasAccess.data?.workspace) return null
    return (
        <div>
            <GlobalHeader workspace={hasAccess.data.workspace} />
            <div className="mt-4 relative">{children}</div>
        </div>
    )
}