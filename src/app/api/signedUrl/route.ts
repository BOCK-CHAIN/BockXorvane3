import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

export const POST = async(req: Request)=>{
    const {fileType, workspaceId, userId,fileName} = await req.json()
    if(!userId){
        return new NextResponse("Unauthorized",{ status: 401});  
    }
    if(!fileType || !workspaceId || !userId){
        return new NextResponse("File is required",{ status: 401});  
    }
    try{
        const storage = new Storage({
            keyFilename: process.env.GCS_FILE_NAME as string
        })
        const source =`${userId}/${workspaceId}/${fileName}-${Date.now()}`
        const [url] = await storage
            .bucket(process.env.GCS_BUCKET_NAME as string)
            .file(source)
            .getSignedUrl({
                version: 'v4',
                action: 'write',
                expires: Date.now() + 15 * 60 * 1000,
                contentType: fileType
            });
        return new NextResponse(JSON.stringify({url,source}),{ status: 200});  
        
    }catch(err){
        console.log(err)
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}