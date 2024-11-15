import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { degreeToRadian } from "@hycord/math";
import { cn, getContrastYIQ, lerp, stringToColor } from "@/lib/utils";
import { useSocket } from "@/lib/contexts/SocketContext";
import { GlobalState } from "@/lib/types";

interface CanvasSpinnerProps {
    className?: string;
    radius?: number;
    forceShow?: boolean
}

export default function Spinner({
    radius = 225,
    className,
    forceShow = false,
}: CanvasSpinnerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCTX] = useState<CanvasRenderingContext2D | null>(null);
    const [rotation, setRotation] = useState(0);
    const [lastRotation, setLastRotation] = useState(-1);
    const [zoom, setZoom] = useState(1);
    const {
        data
    } = useSocket();


    // Set canvas context on mount
    useEffect(() => {
        if (canvasRef.current) {
            setCTX(canvasRef.current.getContext("2d"));
        }
    }, []);

    // Initialize canvas rendering
    useEffect(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        const itemWidth = degreeToRadian(360 / data.games.spinner.items.length);
        const centerX = radius;
        const centerY = radius;

        ctx.save();
        const zoomCenterX = radius;
        const zoomCenterY = radius - radius; // Focus at the top
        ctx.translate(zoomCenterX, zoomCenterY);
        ctx.scale(zoom, zoom);
        ctx.translate(-zoomCenterX, -zoomCenterY);

        data.games.spinner.items.forEach((item, index) => {
            const startRadian = itemWidth * index + degreeToRadian(rotation);
            const sliceRadians = itemWidth;
            const color = stringToColor(item.id);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startRadian, startRadian + sliceRadians);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();

            // Label
            const labelAngle = startRadian + sliceRadians / 2;
            const labelRadius = radius * 0.95;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;

            ctx.save();
            ctx.translate(labelX, labelY);
            ctx.rotate(labelAngle);
            ctx.font = `${radius / 14}px Arial`;
            ctx.textAlign = "end";
            ctx.textBaseline = "middle";
            ctx.fillStyle = getContrastYIQ(stringToColor(item.id));
            ctx.fillText(item.name.substring(0, 15), 0, 0);
            ctx.restore();
        });

        ctx.restore();

        if (data.games.spinner.items.length > 0) { // Draw arrow
            ctx.beginPath();
            ctx.moveTo(centerX - radius / 10, centerY - radius);
            ctx.lineTo(centerX + radius / 10, centerY - radius);
            ctx.lineTo(centerX, centerY - radius + radius / 10);
            ctx.closePath();
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.strokeStyle = "#FFF";
            ctx.lineWidth = radius / 100;
            ctx.stroke();
        }
    }, [ctx, data.games.spinner, rotation, zoom]);


    // Handle animation when history changes
    useEffect(() => {
        if (!ctx || data.games.spinner.history.length === 0) return;

        const latestHistory = data.games.spinner.history[0];
        if (latestHistory.time <= lastRotation) return; // Avoid repeating same spin

        if (lastRotation == -1) {
            setLastRotation(latestHistory.time); // Update last processed spin time

            return
        }
        setLastRotation(latestHistory.time); // Update last processed spin time

        // Find the corresponding item
        const itemIndex = data.games.spinner.items.findIndex((i) => i.id === latestHistory.item.id);
        if (itemIndex === -1) return;

        const itemWidth = 360 / data.games.spinner.items.length;
        const itemMidAngle = itemIndex * itemWidth + itemWidth / 2;
        const currentRotation = rotation % 360;
        const targetAngle = 270;
        const rotationDifference = targetAngle - ((currentRotation + itemMidAngle) % 360);

        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / 8000, 1); // 1 second animation
            function ease(x: number): number {
                return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
            }

            const easedProgress = ease(progress);

            // Smooth animation
            setRotation(rotation + easedProgress * (rotationDifference + 360 * 10)); // Adjust spins
            setZoom(Math.max(1, 1 + easedProgress * 1.75));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Start zoom-out animation after spin finishes
                setTimeout(() => {
                    // animate zoom back to 1
                    setZoom(1);
                }, 3000);
            }
        };

        requestAnimationFrame(animate);
    }, [data.games.spinner.history.length, rotation, lastRotation, ctx, data]);


    return (
        <div className={cn(className, { hidden: !(forceShow || data.admin.active) })}>
            <canvas ref={canvasRef} width={radius * 2} height={radius * 2} />
        </div>
    );
}
