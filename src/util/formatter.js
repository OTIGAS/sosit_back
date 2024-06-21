export function convertDate(date) {
  if (!date) return null
  let parts = date.split('/')
  let dateFormat = `${parts[2]}-${parts[1]}-${parts[0]}`
  return dateFormat
}

export function deconvertDate(date) {
  if (!date) return null
  let parts = date.split('T')[0].split('-')
  let dateFormat = `${parts[2]}/${parts[1]}/${parts[0]}`
  return dateFormat
}
