"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSocket } from "@/lib/contexts/SocketContext";
import { v4 } from "uuid";
import { SpinnerItem } from "@/lib/types";

const formSchema = z.object({
    name: z.string().min(1).max(40),
    type: z.enum(["ceiling", "miniceiling", "floor"]).default("floor"),
    count: z.coerce
        .number()
        .int()
        .positive()
        .min(1).default(1),
    cost: z.coerce
        .number()
        .positive()
        .min(0.01).default(1),
    value: z.coerce
        .number()
        .positive()
        .min(0.01).default(1),
});


export function NewItemForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "floor",
            count: 1,
            cost: 1,
            value: 1,
        },

    });

    const { setData } = useSocket();

    function onSubmit(data: z.infer<typeof formSchema>) {
        form.reset();

        // add count number of items to the list

        const items: SpinnerItem[] = [];
        for (let i = 0; i < data.count; i++) {
            items.push({
                ...data,
                count: 1,
                id: v4()
            });
        }

        setData(d => ({
            ...d, games: {
                ...d.games, spinner: {
                    ...d.games.spinner, items: [...d.games.spinner.items, ...items]
                }
            }
        }));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Item</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SNC Draft Booster" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <Select {...field} defaultValue="floor" onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ceiling">Ceiling</SelectItem>
                                                <SelectItem value="miniceiling">Mini Ceiling</SelectItem>
                                                <SelectItem value="floor">Floor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="count"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Count</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1" min={1} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cost</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )

}