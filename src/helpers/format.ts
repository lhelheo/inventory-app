// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatData = (data: any) => {
  const date = new Date(data)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
