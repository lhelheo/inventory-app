interface TableProps {
  columns: { key: string; label: string }[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: Record<string, any>) => void
}

export default function GenericTable({
  columns,
  data,
  onRowClick,
}: TableProps) {
  return (
    <table className="w-full table-auto border border-gray-700">
      <thead>
        <tr className="bg-[#1]">
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-4 py-2 text-left text-gray-200 bg-[#333333]"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            className="odd:bg-[#242424] even:bg-[#181818] bg-[#ffffff] hover:bg-[#ff2c2c] text-gray-200 cursor-pointer"
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-2">
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
