import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode
  className?: string
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        'flex items-center gap-2 text-md py-2.5 px-4 rounded-md transition duration-300 focus:outline-none bg-violet-500 text-violet-50 hover:bg-violet-600 focus:bg-violet-500 focus:drop-shadow-lg tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
