"use server";

import { client } from "@/lib/prisma";
import { auth } from "@/auth";

export const checkForUser = async (
) => {
  const session = await auth();
  const user = session?.user
  if (!user) {
    return { status: 403 };
  }
  const userExist = await client.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      subscription: true
    },
  })
  if(!userExist) {
    return { status: 403 };
  }

  return { status: 200, user: userExist };
  
};


export const addVideo=async (workspaceId: string, imageUrl: string, userId: string) => {
  try{
    const video = await client.video.create({
      data:{
        source: imageUrl,
        userId,
        workSpaceId: workspaceId,
        processing: false
      }
    })
    return {status: 200, video};
  }catch(err){
    console.log(err)
    return {
      status: 500,
      error: "Error uploading video"
    }
  }
}