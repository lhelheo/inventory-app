interface ButtonProps {
  children: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  icon?: React.ReactNode
  width?: 'w-full' | 'w-1/2' | 'w-1/3' | 'w-1/4' | 'w-1/5' | 'w-76' | 'w-96'
  disabled?: boolean
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      type={props.type || 'button'}
      onClick={props.onClick}
      className={`bg-[#242424] flex justify-center hover:bg-[#333333] text-[#e3e3e3] rounded p-3 gap-3 ${props.width ? props.width : 'w-full'} font-medium ease-linear transition duration-200`}
    >
      {props.icon}
      {props.children}
    </button>
  )
}
