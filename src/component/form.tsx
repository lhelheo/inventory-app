import { FormEvent, ReactNode } from 'react'

interface FormProps {
  onSubmit: (e: FormEvent) => void
  children: ReactNode
}

export const Form = (props: FormProps) => {
  return (
    <form onSubmit={props.onSubmit} className="grid gap-4 sm:grid-cols-2">
      {props.children}
    </form>
  )
}
