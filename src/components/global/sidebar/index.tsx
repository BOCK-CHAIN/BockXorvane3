"use client"
import { getWorkSpaces } from "@/actions/workspace"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import type { NotificationProps, WorkspaceProps } from "@/types/index.type"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import Modal from "../modal"
import { Menu, PlusCircle, LogOut } from "lucide-react"
import Search from "../search"
import { MENU_ITEMS } from "@/constants"
import SidebarItem from "./sidebar-item"
import { getNotifications } from "@/actions/user"
import { useQueryData } from "@/hooks/useQueryData"
import WorkspacePlaceholder from "./workspace-placeholder"
import GlobalCard from "../global-card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import InfoBar from "../info-bar"
import { useDispatch } from "react-redux"
import { WORKSPACES } from "@/redux/slices/workspaces"
import XorvaneLogo from "../XorvaneLogo"
import { Subscription } from "@prisma/client"
import { signOut } from "next-auth/react"

type Props = {
  activeWorkspaceId: string
  subscription: Subscription
}

const Sidebar = ({ activeWorkspaceId, subscription }: Props) => {
  const router = useRouter()
  const pathName = usePathname()
  const dispatch = useDispatch()

  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkSpaces)
  const menuItems = MENU_ITEMS(activeWorkspaceId)

  const { data: notifications } = useQueryData(["user-notifications"], getNotifications)

  const { data: workspace } = data as WorkspaceProps
  const { data: count } = notifications as NotificationProps

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`)
  }
  const currentWorkspace = workspace.workspace.find((s) => s.id === activeWorkspaceId)

  if (isFetched && workspace) {
    dispatch(WORKSPACES({ workspaces: workspace.workspace }))
  }

  const SidebarSection = (
    <div className="bg-card z-50 flex-none overflow-y-auto relative p-4 h-screen no-scrollbar w-[250px] flex flex-col gap-4 items-center">
      <div className="bg-card p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <XorvaneLogo></XorvaneLogo>
      </div>
      <Select defaultValue={activeWorkspaceId} onValueChange={onChangeActiveWorkspace}>
        <SelectTrigger className="mt-16 text-muted-foreground bg-transparent">
          <SelectValue placeholder="Select a workspace"></SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspace.workspace.map((workspace) => (
              <SelectItem value={workspace.id} key={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
            {workspace.members.length > 0 &&
              workspace.members.map(
                (workspace) =>
                  workspace.WorkSpace && (
                    <SelectItem value={workspace.WorkSpace.id} key={workspace.WorkSpace.id}>
                      {workspace.WorkSpace.name}
                    </SelectItem>
                  ),
              )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {currentWorkspace?.type === "PUBLIC" && workspace.subscription?.plan != "NONE" && (
        <Modal
          trigger={
            <span className="text-sm cursor-pointer flex items-center justify-center bg-secondary hover:bg-secondary/80 w-full rounded-sm p-[5px] gap-2">
              <PlusCircle size={15} className="text-secondary-foreground/80 fill-muted-foreground" />
              <span className="text-muted-foreground font-semibold text-xs">Invite To Workspace</span>
            </span>
          }
          title="Invite To Workspace"
          description="Invite other users to your workspace"
        >
          <Search workspaceId={activeWorkspaceId} />
        </Modal>
      )}

      <p className="w-full text-muted-foreground font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              href={item.href}
              icon={item.icon}
              selected={pathName === item.href}
              title={item.title}
              key={item.title}
              activeColor={item.activeColor}
              hoverColor={item.hoverColor}
              textColor={item.textColor}
              notifications={(item.title === "Notifications" && count._count && count._count.notification) || 0}
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full text-muted-foreground font-bold mt-4">Workspaces</p>

      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-muted-foreground/30 font-medium text-sm">
            {workspace.subscription?.plan === "NONE" ? "Upgrade to create workspaces" : "No Workspaces"}
          </p>
        </div>
      )}

      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map(
              (item) =>
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathName === `/dashboard/${item.id}`}
                    title={item.name}
                    notifications={0}
                    key={item.name}
                    icon={<WorkspacePlaceholder>{item.name.charAt(0)}</WorkspacePlaceholder>}
                  />
                ),
            )}
          {workspace.members.length > 0 &&
            workspace.members.map((item) => (
              <SidebarItem
                href={`/dashboard/${item.WorkSpace.id}`}
                selected={pathName === `/dashboard/${item.WorkSpace.id}`}
                title={item.WorkSpace.name}
                key={item.WorkSpace.name}
                icon={<WorkspacePlaceholder>{item.WorkSpace.name.charAt(0)}</WorkspacePlaceholder>}
              />
            ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <Button onClick={() => signOut({ callbackUrl: `${window.location.origin}/auth/sign-in` })} className="w-full mt-4 text-red-500 hover:text-red-400 flex items-center gap-2">
        <LogOut size={18} /> Logout
      </Button>
    </div>
  )
  return (
    <div className="full">
      {subscription && subscription.plan!="NONE" && <InfoBar />}
      <div className="md:hidden fixed my-4 z-50">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  )
}

export default Sidebar
