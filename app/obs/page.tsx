"use client";

import BattleshipBoard from "@/lib/components/custom/games/battleship/BattleshipBoard";
import Spinner from "@/lib/components/custom/games/spinner/Spinner";
import { useSocket } from "@/lib/contexts/SocketContext";
import { useState, useEffect, useMemo, useCallback } from "react";

export default function Page() {
    const { data, emit } = useSocket();
    const [obsHandle, setObsHandle] = useState<typeof window.obsstudio | null>(null);

    useEffect(() => {
        if (window.obsstudio) {
            setObsHandle(window.obsstudio);
        }
    }, []);

    useEffect(() => {
        if (!obsHandle || !data.obs.activeScene) return;
        obsHandle.setCurrentScene(data.obs.activeScene);
    }, [data.obs.activeScene, obsHandle]);

    const ActiveScene = useCallback(() => {
        switch (data.admin.activeGame) { 
            case null:
                return <div className="text-5xl text-white">No active game</div>
            case "battleship":
                return <div className="w-full aspect-square"><BattleshipBoard /></div>
            case "spinner":
                return <div className="w-full aspect-square flex items-center justify-center">
                    <Spinner />
                </div>
            default:
                return <>GAME NOT FOUND</>
        }
    }, [data.admin.activeGame]);

    if (!data) {
        return <div>Loading...</div>; // Handle loading state
    }

    return <ActiveScene />;
}