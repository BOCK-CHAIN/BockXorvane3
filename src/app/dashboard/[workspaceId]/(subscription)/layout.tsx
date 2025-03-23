import { onAuthenticateUser } from '@/actions/user'
import { verifyAccessToWorkspace } from '@/actions/workspace'
import GlobalHeader from '@/components/global/global-header'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ClipboardIcon } from 'lucide-react'
import Link from 'next/link'
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

    const user = await onAuthenticateUser();
    if (!user.user) {
        redirect('/auth/sign-in');
    }
    return (
        <>
            {user.user?.subscription?.plan === "NONE" &&
                <div className="absolute h-screen -top-0 -left-10 -right-10 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
                    <Card>
                        <CardHeader>
                            <CardTitle>Please Subscribe</CardTitle>
                            <CardDescription>
                                You need to subscription to a plan to access the features of this workspace.
                            </CardDescription>
                            <Link
                                href={`/dashboard/${params.workspaceId}/billing`}
                                className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
                            >
                                <ClipboardIcon />
                                Billing
                            </Link>
                        </CardHeader>
                    </Card>
                </div>}
            <div>
                <GlobalHeader workspace={hasAccess.data.workspace} />
                <div className="mt-4 relative">{children}</div>
            </div>
        </>

    )
}