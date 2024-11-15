"use client";
import { useSocket } from "@/lib/contexts/SocketContext";
import { cn } from "@/lib/utils";

export default function BattleshipSpace({
    x,
    y,
    forceShow = false,
}: {
    x: number;
    y: number;
    forceShow?: boolean;
}) {
    const {
        data: { games: { battleship: data } },
        setData
    } = useSocket();

    const toggleHit = (x: number, y: number) => {
        const spaces = data.spaces;
        const column = spaces[x];
        if (!column) return;
        column[y] = { ...column[y], hasBeenHit: !column[y].hasBeenHit };
        setData((d) => ({ ...d, games: { ...d.games, battleship: { ...d.games.battleship, spaces } } }));
    }

    const toggleShip = (x: number, y: number) => {
        const spaces = data.spaces;
        const column = spaces[x];
        if (!column) return;
        column[y] = { ...column[y], containsShip: !column[y].containsShip };
        setData((d) => ({ ...d, games: { ...d.games, battleship: { ...d.games.battleship, spaces } } }));
    }

    return <div onClick={(e) => {
        e.preventDefault();

        // if shift held down, toggle ship
        if (e.ctrlKey) toggleShip(x, y);
        // if not, hit
        else toggleHit(x, y);
        // setHit(x, y)

    }} className={cn(
        "w-6 h-6 rounded-full relative aspect-square bg-blue-800 md:w-6 md:h-6 z-10 hover:bg-orange-200",
        {
            "bg-white": data.spaces[x][y]!.hasBeenHit && !data.spaces[x][y]!.containsShip,
            "bg-red-500": data.spaces[x][y]!.hasBeenHit && data.spaces[x][y]!.containsShip,
        })}>
        <div className={cn("w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full ",
            {
                "bg-black/50": data.spaces[x][y]!.hasBeenHit,
                "bg-white": !data.spaces[x][y]!.hasBeenHit && !data.spaces[x][y]!.containsShip && forceShow,
                "bg-red-500": !data.spaces[x][y]!.hasBeenHit && data.spaces[x][y]!.containsShip && forceShow,
            }
        )}></div>

    </div>
}