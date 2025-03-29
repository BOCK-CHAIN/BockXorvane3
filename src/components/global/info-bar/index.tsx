import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Search, UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import Loader from "../loader";
import { useParams } from "next/navigation";
import { addVideo, checkForUser } from "@/actions/video";

const InfoBar = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { workspaceId } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    const userExist = await checkForUser();

    if (userExist.status !== 200 || !userExist.user) {
      setIsUploading(false);
      toast.error("Please sign in to upload video");
      return;
    }

    if (file) {
      try {
        const resp = await fetch(`/api/signedUrl`, {
          method: "POST",
          body: JSON.stringify({
            fileType: file.type,
            workspaceId: workspaceId,
            userId: userExist.user.id,
            fileName: file.name,
          }),
        });

        const { url, source } = await resp.json();

        if (!url || !source) {
          setIsUploading(false);
          return toast.error("Error uploading video");
        } 

        await axios.put(url, file.slice(), {
          headers: { "Content-Type": file.type },
        });

        const res = await addVideo(
          Array.isArray(workspaceId) ? workspaceId[0] : workspaceId,
          source,
          userExist.user.id
        );

        if (res.status === 200) {
          toast.success("Video uploaded successfully");
        } else {
          toast.error(res.error);
        }
      } catch (err) {
        console.log(err);
        toast.error("Error uploading video. Please try again");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <header className="pl-20 z-50 md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4">
        <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
          <Search size={25} className="text-[#707070]" />
          <Input
            className="bg-transparent border-none !placeholder-neutral-500"
            placeholder="Search for people, projects, tags & folders"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="bg-[#9d9d9d] flex items-center z-50 gap-2 cursor-pointer"
            onClick={handleUploadClick}
          >
            <UploadIcon size={20} />{" "}
            <span className="flex items-center gap-2">Upload</span>
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </header>

      {/* Uploading Dialog */}
      <Dialog open={isUploading}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Uploading Video</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader state color="black" />
            <p className="text-sm text-gray-600">Please wait while your video is being uploaded...</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InfoBar;
