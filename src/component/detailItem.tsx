import { ElementType } from 'react'

interface DetailItemProps {
  icon: ElementType
  value: string
  label: string
}

export const DetailItem = (props: DetailItemProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-[#181818] p-2 rounded-full">
        <props.icon />
      </div>
      <div>
        <p className="text-lg text-[#b0b0b0]">{props.label}</p>
        <p className="text-lg font-semibold">{props.value}</p>
      </div>
    </div>
  )
}
