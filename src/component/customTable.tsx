import { ReactNode } from 'react'

interface Column {
  key: string
  label: string
  formatAs?: (value: string) => string
}

interface Action {
  label: string
  icon: ReactNode
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (row: Record<string, any>) => void
}

interface TableProps {
  columns: Column[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[]
  actions?: Action[]
}

export default function CustomTable(props: TableProps) {
  return (
    <table className="table-auto w-full shadow-md rounded text-white">
      <thead className="bg-[#242424]">
        <tr className="text-[#e3e3e3]">
          {props.columns.map((column) => (
            <th key={column.key} className="px-4 py-2 text-left">
              {column.label}
            </th>
          ))}
          {props.actions && <th className="px-4 py-2 text-left">Ações</th>}
        </tr>
      </thead>
      <tbody>
        {props.data.map((row, index) => (
          <tr
            key={index}
            className={`border-t border-[#242424] hover:bg-[#333333] transition-all duration-300 ${
              index % 2 === 0 ? 'even:bg-gray-800' : 'odd:bg-[#181818]'
            }`}
          >
            {props.columns.map((column) => (
              <td key={column.key} className="px-4 py-2">
                {column.formatAs
                  ? column.formatAs(row[column.key])
                  : row[column.key] || 'Não informado'}
              </td>
            ))}
            {props.actions && (
              <td className="flex py-3 px-4 text-center space-x-2 gap-4">
                {props.actions.map((action, actionIndex) => (
                  <div
                    key={actionIndex}
                    className={`${action.className} flex font-bold cursor-pointer border border-gray-500 border-opacity-35 p-2 rounded ease-linear transition-all hover:opacity-80`}
                    onClick={() => action.onClick(row)}
                    title={action.label}
                  >
                    {action.icon}
                  </div>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
