"use client";

import SocketIndicator from "@/lib/components/custom/socket/SocketIndicator";
import { useSocket } from "@/lib/contexts/SocketContext";

export default function Page() {

  const {
    data,
    state,
    setData
  } = useSocket();
  return <div
    className="flex flex-col items-center justify-center w-full h-full"
  >
    <div className="w-full flex flex-row items-start justify-center">
      <div className="flex flex-row items-center justify-start">
        <p className="mr-2">Socket is currently: {state}</p> <SocketIndicator />
      </div>
    </div>
  </div>
}