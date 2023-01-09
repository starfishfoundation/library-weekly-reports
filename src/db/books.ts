import db from '~/db'
import { getImport } from '~/db/import'
import { ImportError } from '~/utils/errors'

interface ParseOptions {
  onError: (err: ImportError) => boolean
}

interface ImportParams {
  lastModified?: Date
  onError: (err: ImportError) => boolean
}

export async function parseBooks(file, opts: ParseOptions) {
  let data = JSON.parse(file)

  if (!opts.onError) {
    opts.onError = err => { throw err }
  }

  const getLanguage = entry => {
    let err
    const values = ['Farsi', 'Arabic', 'Somali', 'French', 'English', 'German', 'Greek', 'Other']
    for (const tag of entry.tags || []) {
      if (values.includes(tag)) {
        if (entry.language?.[0] && tag !== entry.language[0]) {
          err = new ImportError(
            `Language says "${entry.language[0]}" but tags say "${tag}"`,
            {
              level: 'error',
              bookId: entry.books_id,
              title: entry.title,
            }
          )
          opts.onError(err)
          entry.errors.push(err.serialize())
        }

        return tag
      }
    }

    if (entry.language?.[0]) {
      if (!values.includes(entry.language[0])) {
        return 'Other'
      }

      return entry.language[0]
    }

    err = new ImportError('No language found', {
      level: 'error',
      bookId: entry.books_id,
      title: entry.title,
    })
    opts.onError(err)
    entry.errors.push(err.serialize())
    return 'Other'
  }

  const getAudience = entry => {
    let err
    const values = ['Adults', 'Kids']
    const mapping = {
      Adults: ['Adults', 'Adult'],
      Kids: ['Kids', 'Teen'],
    }

    for (const tag of entry.tags || []) {
      for (const [value, queries] of Object.entries(mapping)) {
        if (queries.includes(tag)) {
          return value
        }
      }
    }

    if ((entry.tags || []).includes('Dictionary')) {
      return 'Adults'
    }

    err = new ImportError('No audience found, falling back to "Adults"', {
      level: 'warning',
      bookId: entry.books_id,
      title: entry.title,
    })
    opts.onError(err)
    entry.errors.push(err.serialize())
    return 'Adults'
  }

  const getTopic = entry => {
    let err
    const values = ['Fiction', 'Non fiction', 'Educational/sciences', 'Languages']
    const mapping = {
      'Fiction': ['Fiction'],
      'Non fiction': ['Non fiction'],
      'Educational/sciences': ['Educational/sciences'],
      'Languages': ['Languages', 'Language Learning', 'Dictionary'],
    }

    for (const tag of entry.tags || []) {
      for (const [value, queries] of Object.entries(mapping)) {
        if (queries.includes(tag)) {
          return value
        }
      }
    }

    err = new ImportError('No topic found, falling back to "Other"', {
      level: 'warning',
      bookId: entry.books_id,
      title: entry.title,
    })
    opts.onError(err)
    entry.errors.push(err.serialize())
    return 'Other'
  }

  data = Object.values(data).map(entry => {
    entry.errors = []

    return {
      id: entry.books_id,
      title: entry.title,
      language: getLanguage(entry),
      audience: getAudience(entry),
      topic: getTopic(entry),
      errors: entry.errors,
    }
  })

  return data
}

export async function importBooks(file, params: ImportParams) {
  const conn = await db.getInstance()
  // ignore errors, gather them for inspection
  const onError = () => true

  const values = await parseBooks(file, { onError })

  if (values.some(v => v.errors.length)) {
    // error level if any book contains an ImportError with error level instead of warning
    const level = values.some(v => {
      return v.errors.some(e => e.level === 'error')
    }) ? 'error' : 'warning'

    const errors = values.filter(v => v.errors.length).map(v => ({
      bookId: v.bookId,
      title: v.title,
      errors: v.errors,
    }))

    const err = new ImportError('Data error', { level, errors })
    params.onError(err)
  }

  await conn.remove({
    from: 'Book',
  })
  await conn.insert({
    into: 'Book',
    values,
  })

  if (params.lastModified) {
    await conn.insert({
      into: 'Import',
      values: [{
        id: 'Book',
        lastModified: params.lastModified,
      }]
    })
  }
}

export async function getExistingBookInfo() {
  const conn = await db.getInstance()
  const count = await conn.count({
    from: 'Book',
  })

  if (!count) {
    return null
  }

  const lastImport = await getImport('Book')

  return {
    count,
    lastModified: lastImport?.lastModified,
  }
}
