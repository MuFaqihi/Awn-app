"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  onSwipeComplete?: () => void;
  className?: string;
  label?: string;
};

export function SwipeButton({ onSwipeComplete, className, label = "Slide to confirm" }: Props) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const knobRef = React.useRef<HTMLButtonElement>(null);
  const [x, setX] = React.useState(0);
  const [down, setDown] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const up = () => setDown(false);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  function onStart(e: React.MouseEvent | React.TouchEvent) {
    if (done) return;
    setDown(true);
  }

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    if (!down || !trackRef.current || !knobRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const rel = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const max = rect.width - knobRef.current.offsetWidth;
    setX(Math.min(rel, max));
  }

  function onEnd() {
    setDown(false);
    if (!trackRef.current || !knobRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const max = rect.width - knobRef.current.offsetWidth;
    if (x >= max * 0.95) {
      setX(max);
      setDone(true);
      onSwipeComplete?.();
    } else {
      setX(0);
    }
  }

  return (
    <div
      ref={trackRef}
      onMouseMove={onMove}
      onTouchMove={onMove}
      onMouseLeave={onEnd}
      className={cn(
        "relative h-12 w-full select-none rounded-full border bg-muted/60 p-1",
        "shadow-sm backdrop-blur-sm dark:bg-zinc-900/50",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
        {done ? "Confirmed" : label}
      </div>

      <button
        ref={knobRef}
        type="button"
        aria-label="slide knob"
        onMouseDown={onStart}
        onTouchStart={onStart}
        onMouseUp={onEnd}
        onTouchEnd={onEnd}
        style={{ transform: `translateX(${x}px)` }}
        className={cn(
          "relative z-10 h-10 w-10 rounded-full border bg-background shadow transition-[transform]",
          down ? "scale-[1.02]" : "scale-100"
        )}
      />
      <div
        className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-primary/10 transition-all"
        style={{ width: `calc(${x}px + 2.5rem)` }}
      />
    </div>
  );
}