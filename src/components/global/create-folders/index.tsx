'use client'
import FolderPlusDuotine from '@/components/icons/folder-plus-duotone'
import { Button } from '@/components/ui/button'
import { useCreateFolders } from '@/hooks/useCreateFolders'
import React from 'react'

type Props = { workspaceId: string }

const CreateForlders = ({ workspaceId }: Props) => {
  const { onCreateNewFolder } = useCreateFolders(workspaceId)
  return (
    <Button onClick={onCreateNewFolder} className="bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white flex items-center gap-2 py-6 px-4 rounded-2xl">
      <FolderPlusDuotine />
      Create A folder
    </Button>
  )
}

export default CreateForlders
