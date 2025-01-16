export const dateFormat = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  const formattedDate = new Date(date).toLocaleDateString('es-ES', options)

  return formattedDate
}