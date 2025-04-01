"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
}

export function Steps({ currentStep, className, ...props }: StepsProps) {
  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
      {...props}
    />
  )
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
}

export function Step({ title, className, ...props }: StepProps) {
  const index = React.useContext(StepContext)
  const currentStep = React.useContext(CurrentStepContext)

  const completed = currentStep > index
  const active = currentStep === index
  const upcoming = currentStep < index

  return (
    <div
      className={cn(
        "flex-1 relative flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 font-medium text-sm transition-colors",
          completed && "border-primary bg-primary text-primary-foreground",
          active && "border-primary text-primary",
          upcoming && "text-gray-500"
        )}
      >
        {completed ? <Check className="h-4 w-4" /> : index + 1}
      </div>
      <div className="mt-2 text-center text-xs font-medium">{title}</div>
      {index < React.Children.count(React.useContext(StepsChildrenContext)) - 1 && (
        <div
          className={cn(
            "absolute top-4 left-[calc(50%+16px)] right-[calc(50%-16px)] h-0.5 bg-gray-300",
            completed && "bg-primary"
          )}
        ></div>
      )}
    </div>
  )
}

const StepContext = React.createContext<number>(0)
const StepsChildrenContext = React.createContext<React.ReactNode>(null)
const CurrentStepContext = React.createContext<number>(1)

Steps.displayName = "Steps"
Step.displayName = "Step"

export function StepsRenderer({
  currentStep,
  children,
  className,
  ...props
}: StepsProps) {
  return (
    <CurrentStepContext.Provider value={currentStep}>
      <StepsChildrenContext.Provider value={children}>
        <div
          className={cn("flex items-center justify-center space-x-2", className)}
          {...props}
        >
          {React.Children.map(children, (child, index) => (
            <StepContext.Provider value={index}>
              {child}
            </StepContext.Provider>
          ))}
        </div>
      </StepsChildrenContext.Provider>
    </CurrentStepContext.Provider>
  )
}

function StepsRoot({ currentStep, children, ...props }: StepsProps) {
  return (
    <StepsRenderer currentStep={currentStep} {...props}>
      {children}
    </StepsRenderer>
  )
}

// Replace the original Steps component with our new one that manages context
Object.assign(Steps, StepsRoot) 