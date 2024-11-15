import { useSocket } from "@/lib/contexts/SocketContext";
import { cn } from "@/lib/utils";

export default function SocketIndicator({
    className
}: { className?: string }) {
    const {
        // data,
        state,
    } = useSocket();
    return <div
        className={cn(
            className ?? "w-4",
            "flex items-center justify-center rounded-full bg-primary-500 aspect-square text-sm font-medium text-white",
            `${state === "connected" ? "bg-green-500" : state === "connecting" ? "bg-yellow-500" : "bg-red-500"}`
        )}
    ></div>
}