import { SourceDeviceStateProps } from "@/hooks/useMediaSource";
import { useStudioSettings } from "@/hooks/useStudioSettings";
import Loader from "../loader";
import { Headphones, Monitor } from "lucide-react";

type Props = {
  state: SourceDeviceStateProps;
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
      })
    | null;
};

export default function MediaConfigurations({ state, user }: Props) {
  console.log("user", user);
  const activeScreen = state.displays?.find(
    (display) => display.id === user?.studio?.screen
  );
  const activeAudio = state.audioInputs?.find(
    (audio) => audio.deviceId === user?.studio?.mic
  );

  console.log(state);

  const { onPreset, isPending, register } = useStudioSettings(
    user!.id,
    user?.studio?.screen || state.displays?.[0].id,
    user?.studio?.mic || state.audioInputs?.[0].deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );

  return (
    <>
      <form className="flex h-full w-full relative flex-col gap-y-5">
        {isPending && (
          <div className="fixed z-50 w-full top-0 right-0 left-0 h-full rounded-2xl bg-black/80 flex justify-center items-center">
            <Loader state />
          </div>
        )}
        <div className="flex gap-x-5 justify-center items-center">
          <Monitor fill="#575655" color="#575655" size={36} />
          <select
            {...register("screen")}
            className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#57655] bg-transparent w-full"
          >
            {state.displays?.map((display, key) => (
              <option
                selected={activeScreen && activeScreen.id == display.id}
                className="bg-[#171717] cursor-pointer"
                key={display.id}
                value={display.id}
              >
                {display.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-x-5 justify-center items-center">
          <Headphones color="#575655" />
          <select {...register("audio")} className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full" ></select>
        </div>
      </form>
    </>
  );
}
