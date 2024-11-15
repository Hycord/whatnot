"use client";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/LinkButton";
import SocketIndicator from "@/lib/components/custom/socket/SocketIndicator";
import { useSocket } from "@/lib/contexts/SocketContext";
import { confettiConfig, GlobalState, hydraConfig } from "@/lib/types";
import { CircleSlashed, DollarSign, FerrisWheel, Globe, HomeIcon, PartyPopper, Ship } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useReward } from "react-rewards";

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const pathname = usePathname(); // Get the current path
    const {
        setData,
        data,
        trigger,
        state
    } = useSocket();

    useEffect(() => {
        if (!data.admin.activeGame) router.push("/dashboard");
        else router.push(`/dashboard/${data.admin.activeGame}`);
    }, [data.admin.activeGame]);


    const { reward: confetti } = useReward("confetti", "confetti", confettiConfig);
    const { reward: hydras } = useReward("hydras", "emoji", hydraConfig);

    return (
        <div className="w-full h-full grid grid-rows-6 place-items-start md:grid-rows-none md:grid-cols-6 divide-y-2 divide-gray-600 md:divide-y-0 md:divide-x-2">

            <span className="absolute z-[1000] -bottom-5 left-[50%]" id="confetti" />
            <span className="absolute z-[1000] -top-[75%] left-[50%]" id="hydras" />
            <div className="no-scrollbar row-span-1 md:row-span-full md:h-screen md:col-span-2 lg:col-span-1 flex flex-row md:flex-col items-start justify-start p-2 md:overflow-y-scroll md:overflow-x-hidden overflow-x-scroll gap-2 w-full h-full">
                {
                    [
                        { href: "/dashboard", name: <>Dashboard</>, label: null },
                        { href: "/dashboard/spinner", name: <>Spinner</>, label: "spinner" },
                        { href: "/dashboard/battleship", name: <p>Battleship</p>, label: "battleship" },
                    ].map(({ href, name, label }, index) => (
                        <Button
                            onClick={() => {
                                router.push(href);
                                setData(d => ({
                                    ...d, admin: { ...d.admin, activeGame: label, active: false },
                                }));
                            }}
                            key={index}
                            className="aspect-square h-full md:w-full md:h-fit"
                            // size={"icon"}
                            variant={pathname != href ? "default" : "secondary"} // Reactive variant based on the current path
                        >
                            {name}
                        </Button>
                    ))
                }
            </div>
            <div className="row-span-5 md:col-span-4 lg:col-span-5 w-full h-full">
                {children}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-primary/50 p-2 overflow-x-scroll no-scrollbar overflow-y-clip flex flex-row justify-between gap-2 text-primary-foreground">
                <div className="flex flex-row h-full w-fit gap-2">
                    <Button variant={"secondary"} onClick={() => { trigger("confetti"); confetti(); }} className="aspect-square h-full max-w-fit"><PartyPopper /></Button>
                    <Button variant={"secondary"} onClick={() => { trigger("hydras"); hydras(); }} className="aspect-square h-full max-w-fit">🐉</Button>
                    <Button variant={"secondary"} className="aspect-square h-full max-w-fit" onClick={() => setData(d => ({ ...d, obs: { activeScene: d.obs.activeScene == "MAIN" ? "BUDGET" : "MAIN" }, games: { battleship: { ...d.games.battleship, active: false }, spinner: { ...d.games.spinner, active: false } } }))} >{data.obs.activeScene == "MAIN" ? <DollarSign /> : <HomeIcon />}</Button>
                </div>
                    <div className="flex flex-row items-center justify-start pr-2">
                        <p className="mr-2">Socket is currently: {state}</p> <SocketIndicator />
                    </div>
            </div>

        </div>
    );
}
