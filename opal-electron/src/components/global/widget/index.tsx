import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import Loader from "../loader";
import React, { useEffect } from "react";
import { fetchUserProfile } from "@/lib/utils";
import { useMediaSources } from "@/hooks/useMediaSource";
import MediaConfigurations from "../MediaConfigurations";

type Props = {};

type User = {
  status: number;
  user:
    | ({
        subscription: {
          plan: "FREE" | "PRO";
        } | null;
        studio: {
          id: string;
          screen: string | null;
          mic: string | null;
          preset: "HD" | "SD";
          camera: string | null;
          userId: string | null;
        } | null;
      } & {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: string;
        clerkid: string;
      });
} | null;

export default function Widget({}: Props) {
  const { user } = useUser();
  const { state, fetchMediaSources } = useMediaSources();
  
  const [profile, setProfile] = React.useState<User>(null);
  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id).then((p: User) => setProfile(p));
    }
  }, [user]);

  console.log(profile,state)

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="flex h-full justify-center items-center">
          <Loader state color="orange" />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <MediaConfigurations state={state} user={profile.user} />
        ) : (
          <div className="w-full h-full items-center">
            <Loader state color="orange"></Loader>
          </div>
        )}
      </SignedIn>
    </div>
  );
}
