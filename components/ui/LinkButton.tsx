"use client";
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button";
import { useRouter } from "next/navigation";

export interface LinkButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    href: string;
    isActive?: (href: string) => boolean;
}

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
    ({ className, variant,  size, asChild = false, href, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        const router = useRouter();
        const [isActive, setIsActive] = React.useState(false);
        React.useEffect(() => {
            setIsActive(window.location.pathname === href);
        }, [window, href, router]);
        
        return (
            <Comp
                className={cn(buttonVariants({ variant: isActive ? "secondary" : "default", size, className }))}
                ref={ref}
                onClick={(e) => {
                    if (props.onClick) props.onClick(e);
                    router.push(href);
                }}

                {...props}
            />
        )
    }
)
LinkButton.displayName = "LinkButton"

export { LinkButton }
