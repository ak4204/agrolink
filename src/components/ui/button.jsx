import React from 'react'

export function Button({ children, className = '', asChild = false, ...props }) {
  // Very small wrapper used for layout; replace with your UI library button.
  const classNames = `inline-flex items-center justify-center px-3 py-1 rounded ${className}`
  return (
    <button {...props} className={classNames}>
      {children}
    </button>
  )
}
