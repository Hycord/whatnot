"use client";
import { useSocket } from "@/lib/contexts/SocketContext";
import BattleshipSpace from "./BattleshipSpace";
import Image from "next/image";

export default function BattleshipBoard({ forceShow = false }: { forceShow?: boolean }) {
    const {
        data,
    } = useSocket();

    if (!data.admin.active && !forceShow) return <></>;

    return <div className="w-full h-full block relative">
        <Image alt="water" src="/water.png" width={500} height={500} className="absolute top-0 left-0 w-full h-full z-10" />
        <div className="grid grid-rows-11 grid-cols-11 grid-flow-col aspect-square place-items-center w-full z-20 text-white">
            <div className="z-20 bg-gray-400 w-full h-full "></div>
            {new Array(10).fill(0).map((_, i) => <div key={`${i}`} className="z-20 bg-gray-400 w-full h-full flex items-center justify-center text-5xl md:text-xl font-bold">{i}</div>)}
            {
                new Array(10).fill(0).map((row, rowIndex) => (
                    <>
                        {new Array(10).fill(0).map((space, colIndex) => (
                            <>
                                {colIndex == 0 && <div key={`${colIndex}-${rowIndex}-header`} className="z-20 bg-gray-400 w-full h-full flex items-center justify-center text-5xl md:text-xl font-bold">{"ABCDEFGHIJ"[rowIndex]}</div>}
                                <BattleshipSpace
                                    key={`${colIndex}-${rowIndex}`}
                                    x={colIndex}
                                    y={rowIndex}
                                    forceShow={forceShow}
                                />
                            </>
                        ))}
                    </>
                ))
            }
        </div>

    </div>


}