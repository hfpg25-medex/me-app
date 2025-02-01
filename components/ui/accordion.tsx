"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  isCompleted?: boolean
  isDisabled?: boolean
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, isCompleted, isDisabled, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-left [&[data-state=open]>svg.chevron]:rotate-180",
        isDisabled && "opacity-50 cursor-not-allowed hover:no-underline",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <ChevronDown className="chevron h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        <span className="text-lg">{children}</span>
      </div>
      <div 
        className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
          isCompleted && "bg-green-500 border-green-500",
          !isCompleted && !isDisabled && props["data-state"] === "open" && "border-primary",
          !isCompleted && !isDisabled && props["data-state"] !== "open" && "border-gray-600",
          isDisabled && "border-gray-300"
        )}
      >
        {isCompleted ? (
          <Check className="h-2.5 w-2.5 text-white" />
        ) : (
          <span className={cn(
            "w-1 h-1 rounded-full",
            !isDisabled && props["data-state"] === "open" && "bg-primary",
            !isDisabled && props["data-state"] !== "open" && "bg-gray-600",
            isDisabled && "bg-gray-300"
          )} />
        )}
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down px-3"
    {...props}
  >
    <div className={cn("pb-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}
