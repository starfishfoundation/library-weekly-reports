/**
 * Detect book fields.
 *
 * @param {string} title Book title.
 */
export function detectBookData(title: string): any {
  const matches = title.match(/[A-Z]{2}\d{1,2}/)
  if (!matches) {
    return null
  }
  const m = matches[0]

  const data = {}
  switch (m[0]) {
    case 'F': // Farsi
    case 'D': // Dari
      data.Language = 'Farsi'
      break
    case 'A':
      data.Language = 'Arabic'
      break
    case 'S':
      data.Language = 'Somali'
      break
  }

  switch (m[1]) {
    case 'A': // Adults
    case 'D': // Dictionary
      data.Audience = 'Adults'
      break
    case 'C': // Children
      data.Audience = 'Kids'
      break
  }

  if (!Object.keys(data).length) {
    return null
  }

  return data
}
