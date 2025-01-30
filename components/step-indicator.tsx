import { cn } from "@/lib/utils"

interface Step {
  number: number
  label: string
  isActive: boolean
  isEnabled: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  className?: string
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, index) => (
        <>
          {index > 0 && (
            <div className="mx-2 w-10 h-0.5 bg-gray-300" />
          )}
          <div 
            key={step.number}
            className={cn(
              "flex items-center",
              step.isActive ? "text-primary" : "text-muted-foreground",
              !step.isEnabled && "opacity-50"
            )}
          >
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-2">
              {step.number}
            </div>
            {step.label}
          </div>
        </>
      ))}
    </div>
  )
}
