import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


//shadcn/ui creatres auto cn() and merges Tailwind classes (with clsx + tailwind-merge) and is used inside in every shadcn component
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
