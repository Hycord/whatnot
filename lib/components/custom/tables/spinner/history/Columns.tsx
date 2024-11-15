"use client";
import { SpinnerHistory, SpinnerItem } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisIcon, Trash } from "lucide-react";
import { useSocket } from "@/lib/contexts/SocketContext";
import { Button } from "@/components/ui/button";


export const HistoryColumns: ColumnDef<SpinnerHistory>[] = [
    {
        accessorKey: "time",
        header: "Time",
        cell: ({ getValue }) => {
            const time = getValue() as number;
            return <>{new Date(time).toLocaleString()}</>;
        },
    }, {
        accessorKey: "item",
        header: "ID",
        cell: ({ getValue }) => {
            const { id } = getValue() as SpinnerHistory["item"];
            return <>{id.substring(0, 8)}</>;
        },
    },
    {
        accessorKey: "item",
        header: "Item",
        cell: ({ getValue }) => {
            const item = getValue() as SpinnerHistory["item"];
            return <>{item.name}</>;
        },
    },
    {
        accessorKey: "item",
        header: "Type",
        cell: ({ getValue }) => {
            const item = getValue() as SpinnerHistory["item"];
            return <>{item.type}</>;
        },
    },
    {
        accessorKey: "item",
        header: "Count",
        cell: ({ getValue }) => {
            const item = getValue() as SpinnerHistory["item"];
            return <>{item.count}</>;
        },
    },
    {
        accessorKey: "item",
        header: "Cost",
        cell: ({ getValue }) => {
            const item = getValue() as SpinnerHistory["item"];
            return <>{item.cost}</>;
        },
    },
    {
        accessorKey: "item",
        header: "Value",
        cell: ({ getValue }) => {
            const item = getValue() as SpinnerHistory["item"];
            return <>{item.value}</>;
        },
    },
    {
        accessorKey: "item",
        header: "",
        cell: ({ getValue }) => {
            const {
                setData,
                data
            } = useSocket();

            const item = getValue() as SpinnerHistory["item"];

            return <Button
                className="cursor-pointer" disabled={!data.games.spinner.items.find(i => i.id === item.id)} onClick={() => {
                    setData(d => ({
                        ...d, games: {
                            ...d.games, spinner: {
                                ...d.games.spinner, items: d.games.spinner.items.filter(i => i.id !== item.id),
                                // history: d.games.spinner.history.filter(h => h.item.id !== item.id)
                            }
                        }
                    }));
                }}><Trash /></Button>;
        },
    }
];

export const ItemColumns: ColumnDef<SpinnerItem>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => {
            const name = getValue() as SpinnerItem["name"];
            return <>{name}</>;
        },
    }, {
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => {
            const id = getValue() as string;
            return <>{id.substring(0, 8)}</>;
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => {
            const type = getValue() as SpinnerItem["type"];
            return <>{type}</>;
        },
    },
    {
        accessorKey: "count",
        header: "Count",
        cell: ({ getValue }) => {
            const count = getValue() as SpinnerItem["count"];
            return <>{count}</>;
        },
    },
    {
        accessorKey: "cost",
        header: "Cost",
        cell: ({ getValue }) => {
            const cost = getValue() as SpinnerItem["cost"];
            return <>{cost}</>;
        },
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ getValue }) => {
            const value = getValue() as SpinnerItem["value"];
            return <>{value}</>;
        },
    },
    {
        accessorKey: "",
        header: ".",
        cell: ({ row }) => {
            const item = row.getValue("id") as SpinnerItem["id"];
            const {
                setData,
            } = useSocket();
            return <DropdownMenu>
                <DropdownMenuTrigger><EllipsisIcon /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                    {/* <DropdownMenuSeparator /> */}
                    <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        setData(d => ({
                            ...d, games: {
                                ...d.games, spinner: {
                                    ...d.games.spinner, items: d.games.spinner.items.filter(i => i.id !== item),
                                }
                            }
                        }));
                    }}>Remove</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>;
        },
    }
]