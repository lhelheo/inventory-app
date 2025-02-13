import { ChangeEvent } from 'react'

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const SearchBar = (props: SearchBarProps) => {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      className="w-full p-3 bg-[#181818] border border-gray-500 border-opacity-35 shadow-md rounded-lg focus:outline-none text-white placeholder-[#e3e3e3]"
    />
  )
}
