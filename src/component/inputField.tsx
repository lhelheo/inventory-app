import { ChangeEvent } from 'react'

interface InputFieldProps {
  label: string
  name: string
  type: string
  value?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  id?: string
  placeholder?: string
}

export const InputField = (props: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="name" className="block font-medium text-[#e3e3e3]">
        {props.label}
      </label>
      <input
        id="name"
        name="name"
        placeholder="Digite o nome do cliente"
        value={props.value}
        onChange={props.onChange}
        required
        className="w-full p-2 rounded text-[#e3e3e3] bg-[#242424] border border-gray-500 border-opacity-35"
      />
    </div>
  )
}
