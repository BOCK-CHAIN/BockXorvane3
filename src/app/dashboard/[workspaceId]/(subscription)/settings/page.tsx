'use client'

import { enableFirstView, getFirstView } from '@/actions/user'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

const SettingsPage = () => {
  const [firstView, setFirstView] = useState<undefined | boolean>(undefined)
  const { data: session} = useSession();
  const currentUser = session?.user
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  
  useEffect(()=>{
    if(currentUser){
      setUser({name: currentUser.name, email: currentUser.email})
    }
  },[currentUser])

  const switchState = async (checked: boolean) => {
    const view = await enableFirstView(checked)
    if (view) {
      toast(view.status === 200 ? 'Success' : 'Failed', {
        description: view.data,
      })
    }
  }

  return (
    <div className="max-w-md space-y-4">
      {user && (
        <>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input className='text-white' id="name" value={user.name} disabled />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input className='text-white' id="email" value={user.email} disabled />
          </div>
        </>
      )}
      <div>
        <Label className="flex items-center gap-x-3 text-md">
          Enable First View
          <Switch
            onCheckedChange={switchState}
            // disabled={firstView === undefined}
            checked={firstView}
            onClick={() => setFirstView(!firstView)}
          />
        </Label>
      </div>
    </div>
  )
}

export default SettingsPage
