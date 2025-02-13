interface ModalProps {
  isOpen: boolean
  title: string
  message: string
  onClose: () => void
  actions: { label: string; onClick: () => void; className?: string }[]
}

export default function CustomModal(props: ModalProps) {
  if (!props.isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#242424] p-6 rounded-lg shadow-lg text-white w-96">
        <h2 className="text-lg font-semibold mb-4">{props.title}</h2>
        <p className="mb-4">{props.message}</p>
        <div className="flex justify-end space-x-2">
          {props.actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={
                action.className ||
                'bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded'
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
