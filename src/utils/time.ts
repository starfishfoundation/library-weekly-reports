export function getDate(dt) {
  return dt.toISOString().substring(0, 10)
}

export function getDateTime(dt) {
  return dt.toISOString().substring(0, 19).replace('T', ' ')
}

export function getNextDate(dt) {
  dt = new Date(dt)
  return new Date(dt.getTime() + 60 * 60 * 24 * 1000)
}

export function getDateExcelFormat(dt) {
  return dt.toLocaleString('fi', {year: 'numeric', month: '2-digit', day: 'numeric'})
}

export function getDayName(dt) {
  return dt.toLocaleString('en-US', {weekday: 'long'})
}
