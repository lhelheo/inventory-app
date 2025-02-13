// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatData = (data: any) => {
  const date = new Date(data)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 11) return phone

  const ddd = cleaned.slice(0, 2)
  const firstPart = cleaned.slice(2, 3)
  const secondPart = cleaned.slice(3, 7)
  const thirdPart = cleaned.slice(7)

  return `(${ddd}) ${firstPart} ${secondPart}-${thirdPart}`
}
