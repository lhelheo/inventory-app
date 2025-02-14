interface BackButtonProps {
  onClick: () => void
  children: React.ReactNode | string
}

export const BackButton = (props: BackButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className="fixed bottom-4 right-4 bg-[#242424] hover:bg-[#333333] text-white p-4 rounded-full shadow-lg transition duration-300 z-50"
      title="Voltar para a página anterior"
    >
      {props.children}
    </button>
  )
}
