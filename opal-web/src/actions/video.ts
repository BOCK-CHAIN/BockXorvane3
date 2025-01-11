"use server";

import axios from "axios";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const uploadVideo = async (
) => {
  const user = await currentUser();
  if (!user) {
    return { status: 403 };
  }
  const userExist = await client.user.findUnique({
    where: {
      clerkid: user.id,
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
