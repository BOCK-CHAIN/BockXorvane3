
// import { handleFileChange } from "@/actions/video";
import { uploadVideo } from "@/actions/video";
import VideoRecorderIcon from "@/components/icons/video-recorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { Search, UploadIcon } from "lucide-react";
import React, { useRef } from "react";

const InfoBar = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const userExist = await uploadVideo();

    if(userExist.status !== 200 || !userExist.user) {
      return
    }
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userExist.user.id);
      formData.append("plan", userExist.user.subscription?.plan || ""); // Replace with actual user ID.
      console.log(formData);
      try {
        const response = await axios.post("http://localhost:5000/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("File uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }

  

  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search size={25} className="text-[#707070]" />
        <Input
          className="bg-transparent border-none !placeholder-neutral-500"
          placeholder="Search for people, projects, tags & folders"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          className="bg-[#9D9D9D] flex items-center gap-2"
          onClick={handleUploadClick}
        >
          <UploadIcon size={20} />{" "}
          <span className="flex items-center gap-2">Upload</span>
        </Button>
        <Button className="bg-[#9D9D9D] flex items-center gap-2">
          <VideoRecorderIcon />
          <span className="flex items-center gap-2">Record</span>
        </Button>
        <UserButton />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </header>
  );
};

export default InfoBar;
