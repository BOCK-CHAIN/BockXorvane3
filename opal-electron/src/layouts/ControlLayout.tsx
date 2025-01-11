import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X } from "lucide-react";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ControlLayout({ children, className }: Props) {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    console.log(event, payload);

    setIsVisible(payload.state);
  });
  return (
    <div
      className={cn(
        className,
        isVisible && "invisible",
        "bg-[#171717] flex flex-col border-2 border-neutral-700 px-1 rounded-3xl overflow-hidden "
      )}
    >
      <div className="flex justify-between items-center p-5 draggable">
        <span className="non-draggable ">
          <UserButton />
        </span>
        <X
          size={20}
          className="text-gray-400 non-draggable hover:text-white cursor-pointer"
          onClick={onCloseApp}
        />
      </div>
      <div className="flex p-5 w-full">
        <div className="flex items-center gap-x-2">
          <img src="/opal-logo.svg" alt="asdf" />
          <p className="text-white text-2xl">Opal</p>
        </div>
      </div>
      <div className="flex overflow-auto">{children}</div>
    </div>
  );
}
