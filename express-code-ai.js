import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import multer from "multer";
import OpenAI from "openai";

dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
});

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: process.env.FILE_UPLOAD_PATH || "temp_upload/" });

app.post("/", upload.single("file"), async (req, res) => {
  try {
    const { userId, plan } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = file.path;

    // 1. Notify backend about processing
    let processingResponse;
    try {
      processingResponse = await axios.post(
        `${process.env.NEXT_API_HOST}recording/${userId}/processing`,
        { filename: file.originalname }
      );
    } catch (error) {
      console.error("Error notifying backend about processing:", error.message);
    }

    if (processingResponse.status !== 200) {
      console.error("Processing error:", processingResponse.statusText);
    }

    // 2. Upload to AWS S3
    let s3Response;
    try {
      const s3Command = new PutObjectCommand({
        Key: file.originalname,
        Bucket: process.env.S3_BUCKET_NAME,
        ContentType: file.mimetype,
        Body: await fsPromises.readFile(filePath),
      });
      s3Response = await s3.send(s3Command);
    } catch (error) {
      console.error("Error uploading file to AWS S3:", error.message);
    }

    if (s3Response.$metadata.httpStatusCode !== 200) {
      console.error("AWS S3 upload failed");
    }

    if (plan === "PRO") {
      try {
        const stat = await fsPromises.stat(filePath); // Use await with fs.promises.stat
        if (stat.size >= 25000000) {
          throw new Error("File exceeds 25MB limit for transcription");
        }
        if (stat.size < 25000000) {
          const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
            response_format: "text",
          });

          if (transcription) {
            try {
              let completion;
              completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content: `Generate a title and summary using the transcription: ${transcription}`,
                  },
                ],
              });
            } catch (err) {
              console.log(err);
            }

            try {
              await axios.post(
                `${process.env.NEXT_API_HOST}recording/${userId}/transcribe`,
                {
                  filename: file.originalname,
                  transcription,
                  content: completion.choices[0].message.content,
                }
              );
            } catch (error) {
              console.error(
                "Error sending transcription data to backend:",
                error.message
              );
            }
          } else {
            console.log("transcription failed");
          }
        }
      } catch (err) {
        console.log(err, "error in fs");
      }
    }

    try {
      await axios.post(
        `${process.env.NEXT_API_HOST}recording/${userId}/complete`,
        {
          filename: file.originalname,
        }
      );
    } catch (error) {
      console.error("Error notifying backend about completion:", error.message);
    }

    try {
      await fsPromises.unlink(filePath);
    } catch (error) {
      console.error("Error deleting temporary file:", error.message);
      return res.status(500).json({ error: "Failed to delete temporary file" });
    }

    res
      .status(200)
      .json({ message: "File uploaded and processed successfully" });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
