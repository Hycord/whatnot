import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Dashboard({
    items
}: {
    items: ReactNode[];
}) {

    return <div className="w-full h-full grid grid-cols-2 grid-rows-2 p-2">
        {items.slice(0, 4).map((item, index) => item)}
    </div>
}
export const DashboardCard = ({
    children,
    label,
    className,
    color
}: {
    children?: ReactNode;
    label?: ReactNode | string;
    className?: string;
    color?: string;

}) => {
    return <div
        className={cn("w-full h-full flex flex-col relative ")}>
        <div className={cn("h-fit p-2 rounded-t-md", color)}>{label ?? "None"}</div> 
        <ScrollArea className={cn(className, "h-[calc(50vh-4rem)] overflow w-full flex")}>
            {children}
        </ScrollArea>
    </div>

}