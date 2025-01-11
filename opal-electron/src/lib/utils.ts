'use server'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const onCloseApp = () => window.ipcRenderer.send("closeApp");

export const fetchUserProfile = async (clerkid: string) => {
  const response = await httpClient.get(`/auth/${clerkid}`);
  console.log(response)

  return response.data;
};

export const getMediaSources = async () => {
  try {
    const displays = await window.ipcRenderer.invoke("getSources");
    const enumerateDevices =
      await window.navigator.mediaDevices.enumerateDevices();

    const audioInputs = enumerateDevices.filter(
      (device) => device.kind === "audioinput"
    );

    console.log("getting sources");
    return { displays, audio: audioInputs };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: 'HD' | 'SD',
) => {
  const response = await httpClient.post(`/studio/${id}`, {
    screen,
    audio,
    preset,
  });

  return response.data;
}