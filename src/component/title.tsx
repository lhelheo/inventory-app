interface TitleProps {
  title: string
}

export const Title = (props: TitleProps) => {
  return <h2 className="text-2xl font-bold text-[#e3e3e3]">{props.title}</h2>
}
