"use client";
import { Button } from "@/components/ui/button";
import { Dashboard, DashboardCard } from "@/lib/components/custom/dashboard/Dashboard";
import BattleshipBoard from "@/lib/components/custom/games/battleship/BattleshipBoard";
import BattleshipSpace from "@/lib/components/custom/games/battleship/BattleshipSpace";
import { useSocket } from "@/lib/contexts/SocketContext";
import { PlayIcon, StopCircle } from "lucide-react";

export default function Page() {
    const {
        data,
        setData
    } = useSocket();

    return <Dashboard items={[
        <DashboardCard
            color="bg-green-500 text-white"
            label={(<>Controls</>)}>
            <Button className="aspect-square h-fit" onClick={() => setData(d => ({ ...d, admin: { ...d.admin, active: !d.admin.active } }))} variant={data.admin.active ? "default" : "destructive"}>{data.admin.active ? <StopCircle /> : <PlayIcon />}</Button>
        </DashboardCard>,
        <DashboardCard
            color="bg-orange-500 text-white"
            label={(<>Game State</>)}>
            <div className="max-w-[75%] aspect-square max-h-[75%]">

                <BattleshipBoard forceShow={true} />
            </div>
        </DashboardCard>,
        // <DashboardCard
        //     color="bg-pink-500 text-white">
        // </DashboardCard>,
        // <DashboardCard color="bg-blue-500 text-white">
        // </DashboardCard>,

    ]} />
}