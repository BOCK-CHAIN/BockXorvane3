import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner'

type Props = { title: string; id: string; source: string; description: string }

const RichLink = ({ description, id, source, title }: Props) => {
  const copyRichText = async () => {
    const originalTitle = title;
    const thumbnail = `<a style="display: flex; flex-direction: column; gap: 10px" href="${process.env.NEXT_PUBLIC_HOST_URL}/preview/${id}">
      <h3 style="text-decoration: none; color: black; margin: 0;">${originalTitle}</h3>
      <p style="text-decoration: none; color: black; margin: 0;">${description}</p>
      <video
          width="320"
          style="display: block"
          >
              <source
                  type="video/webm"
                  src="${process.env.NEXT_PUBLIC_GCP_CDN}/${source}#1"
              />
          </video>
      </a>`;
  
    try {
      // Create a temporary textarea element
      const tempTextarea = document.createElement("textarea");
      tempTextarea.value = thumbnail;
      document.body.appendChild(tempTextarea);
  
      // Select and copy the text
      tempTextarea.select();
      document.execCommand("copy");
  
      // Remove the textarea
      document.body.removeChild(tempTextarea);
  
      toast("Embedded Link Copied", {
        description: "Successfully copied embedded link",
      });
    } catch (error) {
      console.error("Failed to copy", error);
      toast("Copy Failed", {
        description: "Could not copy the embedded link.",
      });
    }
  };
  return (
    <Button
      onClick={copyRichText}
      className="rounded-full"
    >
      Get Embedded Code
    </Button>
  )
}

export default RichLink
