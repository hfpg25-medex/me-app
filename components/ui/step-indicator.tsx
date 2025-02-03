import { cn } from "@/lib/utils";
import React from "react";

interface Step {
  number: number;
  label: string;
  isActive: boolean;
  isEnabled: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  className?: string;
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* First row: Numbers with connecting line */}
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {index > 0 && <div className="h-[1px] w-24 bg-gray-300" />}
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                step.isActive ? "bg-blue-500 text-white" : "bg-gray-200"
              )}
            >
              {step.number}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Second row: Labels */}
      <div className="flex">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {index > 0 && <div className="w-24" />}
            <div className={index === 0 ? "w-5" : undefined}>
              <span
                className={cn(
                  "text-sm",
                  step.isActive ? "text-primary" : "text-muted-foreground",
                  !step.isEnabled && "opacity-50"
                )}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
