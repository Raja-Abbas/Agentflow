"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | undefined>(
  undefined
)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within a <Dialog> provider")
  }
  return context
}

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

function Dialog({ children, open: controlledOpen, onOpenChange, defaultOpen = false }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? internalOpen

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(value)
      }
      onOpenChange?.(value)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    const { setOpen } = useDialog()

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onClick: (e: React.MouseEvent) => {
          setOpen(true);
          (children as any).props?.onClick?.(e)
        },
      })
    }

    return (
      <button ref={ref} onClick={() => setOpen(true)} {...props}>
        {children}
      </button>
    )
  }
)
DialogTrigger.displayName = "DialogTrigger"

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onEscapeKeyDown?: () => void
  onPointerDownOutside?: () => void
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    { className, children, onEscapeKeyDown, onPointerDownOutside, ...props },
    ref
  ) => {
    const { open, setOpen } = useDialog()

    React.useEffect(() => {
      if (!open) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onEscapeKeyDown?.()
          setOpen(false)
        }
      }

      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = ""
      }
    }, [open, setOpen, onEscapeKeyDown])

    if (!open) return null

    return createPortal(
      <div className="fixed inset-0 z-50">
        <div
          className="fixed inset-0 bg-black/80 dark:bg-black/60"
          onClick={() => {
            onPointerDownOutside?.()
            setOpen(false)
          }}
        />
        <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <div
            ref={ref}
            className={cn(
              "w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-950",
              className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {children}
          </div>
        </div>
      </div>,
      document.body
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, asChild, children, ...props }, ref) => {
    const { setOpen } = useDialog()

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onClick: (e: React.MouseEvent) => {
          setOpen(false);
          (children as any).props?.onClick?.(e)
        },
      })
    }

    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-slate-950 dark:focus:ring-indigo-400",
          className
        )}
        onClick={() => setOpen(false)}
        {...props}
      >
        {children}
        ✕
        <span className="sr-only">Close</span>
      </button>
    )
  }
)
DialogClose.displayName = "DialogClose"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
