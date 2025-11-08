import React from 'react'

export function DropdownMenu({ children }) {
  return <div className="inline-block">{children}</div>
}

export function DropdownMenuTrigger({ children, asChild }) {
  // If asChild is used, the child is expected to be a button; render it directly.
  return <>{children}</>
}

export function DropdownMenuContent({ children, className = '' }) {
  return <div className={`bg-white shadow rounded p-2 ${className}`}>{children}</div>
}

export function DropdownMenuItem({ children, ...props }) {
  return (
    <div {...props} className={`px-2 py-1 hover:bg-stone-100 ${props.className || ''}`}>
      {children}
    </div>
  )
}

export function DropdownMenuSeparator() {
  return <div className="my-2 border-t" />
}
