"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DialogCtx = React.createContext<DialogContextValue | null>(null);

function useDialogCtx() {
  const ctx = React.useContext(DialogCtx);
  if (!ctx) throw new Error("Dialog components must be used inside <Dialog>.");
  return ctx;
}

type DialogProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Dialog({ children, open, defaultOpen, onOpenChange }: DialogProps) {
  const isControlled = typeof open === "boolean";
  const [internal, setInternal] = React.useState<boolean>(!!defaultOpen);
  const valueOpen = isControlled ? (open as boolean) : internal;

  const setOpen = (v: boolean) => {
    if (!isControlled) setInternal(v);
    onOpenChange?.(v);
  };

  return (
    <DialogCtx.Provider value={{ open: valueOpen, setOpen }}>
      {children}
    </DialogCtx.Provider>
  );
}

/* ───────── Trigger ───────── */
export function DialogTrigger({
  asChild,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const { setOpen } = useDialogCtx();

  if (asChild && React.isValidElement(children)) {
    // Type assertion to tell TypeScript this element can accept onClick
    const child = children as React.ReactElement<any>;
    
    return React.cloneElement(child, {
      ...rest,
      onClick: (e: React.MouseEvent) => {
        // Call the original onClick if it exists
        child.props?.onClick?.(e);
        setOpen(true);
      },
      "aria-haspopup": "dialog" as const,
      "aria-expanded": false,
    });
  }

  return (
    <button
      type="button"
      {...rest}
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={false}
    >
      {children}
    </button>
  );
}

/* ───────── Overlay ───────── */
export function DialogOverlay({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      data-state="open"
    />
  );
}

/* ───────── Content (portal) ───────── */
export function DialogContent({
  className,
  children,
  onPointerDownOutside,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  onPointerDownOutside?: (e: PointerEvent) => void;
}) {
  const { open, setOpen } = useDialogCtx();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Close on ESC
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Focus content when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => contentRef.current?.focus(), 0);
    }
  }, [open]);

  if (!mounted || !open) return null;

  const node = (
    <>
      <DialogOverlay onClick={() => setOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        ref={contentRef}
        className={cn(
          "fixed z-50 left-1/2 top-1/2 w-[min(95vw,520px)] -translate-x-1/2 -translate-y-1/2",
          "rounded-xl border bg-background p-6 shadow-xl outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className
        )}
        data-state="open"
        {...props}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => {
          // click outside already handled by overlay; optional hook here
          onPointerDownOutside?.(e.nativeEvent);
        }}
      >
        {children}
      </div>
    </>
  );

  return createPortal(node, document.body);
}

/* ───────── Extras (header/footer/title/description/close) ───────── */
export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function DialogClose({
  asChild,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = useDialogCtx();
  
  if (asChild && React.isValidElement(children)) {
    // Properly type the child element to accept onClick
    const child = children as React.ReactElement<any>;
    
    return React.cloneElement(child, {
      ...rest,
      onClick: (e: React.MouseEvent) => {
        // Call the original onClick if it exists
        child.props?.onClick?.(e);
        setOpen(false);
      },
    });
  }
  
  return (
    <button type="button" {...rest} onClick={() => setOpen(false)}>
      {children}
    </button>
  );
}