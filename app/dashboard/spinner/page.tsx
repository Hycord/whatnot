"use client";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dashboard, DashboardCard } from "@/lib/components/custom/dashboard/Dashboard";
import { NewItemForm } from "@/lib/components/custom/forms/spinner/NewItemForm";
import Spinner from "@/lib/components/custom/games/spinner/Spinner";
import { HistoryColumns, ItemColumns } from "@/lib/components/custom/tables/spinner/history/Columns";
import { DataTable } from "@/lib/components/custom/tables/spinner/history/DataTable";
import { useSocket } from "@/lib/contexts/SocketContext";
import { cn } from "@/lib/utils";
import { PlayIcon, RotateCw, Shuffle, StopCircle, Trash } from "lucide-react";
import { ReactNode } from "react";

export default function Page() {
    const {
        data,
        setData
    } = useSocket();

    return <Dashboard items={[
        <DashboardCard
            color="bg-green-500 text-white"
            label={(<>Controls</>)}>

            <div className="w-full flex flex-row items-start justify-start gap-2 mb-2">
                <Button className="aspect-square h-fit" onClick={() => setData(d => ({ ...d, admin: { ...d.admin, active: !d.admin.active } }))} variant={data.admin.active ? "default" : "destructive"}>{data.admin.active ? <StopCircle /> : <PlayIcon />}</Button> 
                <Button className="aspect-square h-fit" onClick={
                    () => {
                        // pick an item, remove it from list, add it to history
                        const item = data.games.spinner.items[
                            Math.floor(Math.random() * data.games.spinner.items.length)
                        ];
                        setData(d => ({
                            ...d, games: {
                                ...d.games, spinner: {
                                    ...d.games.spinner,
                                    // items: d.games.spinner.items.filter(i => i.id !== item.id), 
                                    history: [{ time: Date.now(), item }, ...d.games.spinner.history]
                                }
                            }
                        }));
                    }
                } ><RotateCw /></Button>
                <Button className="aspect-square h-fit" onClick={
                    () => {
                        // pick an item, remove it from list, add it to history
                        const shuffled = data.games.spinner.items.sort(() => Math.random() - 0.5);
                        setData(d => ({
                            ...d, games: {
                                ...d.games, spinner: {
                                    ...d.games.spinner,
                                    items: shuffled,
                                }
                            }
                        }));
                    }
                } ><Shuffle /></Button>
            </div>
            <Collapsible>
                <CollapsibleTrigger><Button>New Item Form</Button></CollapsibleTrigger>
                <CollapsibleContent>
                    <NewItemForm />
                </CollapsibleContent>
            </Collapsible>
        </DashboardCard>,
        <DashboardCard
            color="bg-orange-500 text-white"
            label={(<>Game State</>)}>
            <Spinner className="" forceShow={true} radius={150} />
        </DashboardCard>,
        <DashboardCard
            color="bg-pink-500 text-white"
            label={(<div className="flex items-center justify-between">
                <p>History ({data.games.spinner.history.length})</p>
                <Trash
                    onClick={() => setData(d => ({ ...d, games: { ...d.games, spinner: { ...d.games.spinner, history: [] } } }))}
                    className="cursor-pointer hover:text-black"
                />
            </div>)}>
            <DataTable columns={HistoryColumns} data={data.games.spinner.history} />
        </DashboardCard>,
        <DashboardCard
            color="bg-blue-500 text-white"
            label={(<div className="flex items-center justify-between">
                <p>Items ({data.games.spinner.items.length})</p>
                <Trash
                    onClick={() => setData(d => ({ ...d, games: { ...d.games, spinner: { ...d.games.spinner, items: [] } } }))}
                    className="cursor-pointer hover:text-black"
                />
            </div>)}>
            <DataTable columns={ItemColumns} data={data.games.spinner.items} />
        </DashboardCard>,
    ]} />
}