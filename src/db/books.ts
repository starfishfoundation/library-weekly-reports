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

type Mapping = {[key: string]: string[]}

function normalizeMapping(mapping: Mapping): Mapping {
  return Object.fromEntries(Object.entries(mapping).map(([key, vals]) => {
    return [key, vals.map(v => v.toLowerCase())]
  }))
}

function searchMapping(mapping: Mapping, query: string): string | null {
  query = query.toLowerCase()
  for (const [value, queries] of Object.entries(mapping)) {
    if (queries.includes(query)) {
      return value
    }
  }
  return null
}

export async function parseBooks(file, opts: ParseOptions) {
  let data = JSON.parse(file)

  if (!opts.onError) {
    opts.onError = err => { throw err }
  }

  const getLanguage = entry => {
    let err
    const mapping = normalizeMapping({
      'Farsi': ['Farsi', 'Farsi kids fiction', 'Farsi adults fiction', 'Persian', 'Dari', 'Pashto'],
      'Arabic': ['Arabic'],
      'Somali': ['Somali'],
      'French': ['French'],
      'English': ['English'],
      'German': ['German'],
      'Greek': ['Greek'],
      'Amharic': ['Amharic'],
      'Other': ['Other'],
    })

    let language = entry.language?.[0]
    language = language ? searchMapping(mapping, language) : null

    let tags: string[] = entry.tags || []
    // has English in tags and also some other language
    const isMultilingualEnglish =
      tags.map(t => t.toLowerCase()).includes('English'.toLowerCase())
      && tags.some(t => {
        const m = searchMapping(mapping, t)
        return m && m !== 'English'
      })

    if (isMultilingualEnglish) {
      tags = tags.filter(t => t.toLowerCase() !== 'English'.toLowerCase())
    }

    for (const tag of tags) {
      const m = searchMapping(mapping, tag)
      if (!m) {
        continue
      }

      if (language && m !== language) {
        err = new ImportError(
          `Language says "${language}" but tags say "${m}"`,
          {
            level: 'error',
            bookId: entry.books_id,
            title: entry.title,
          }
        )
        opts.onError(err)
        entry.errors.push(err.serialize())
      }

      return m
    }

    if (entry.language?.[0]) {
      // if language field was set, return match from mapping or 'Other' as fallback
      return language || 'Other'
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
    const mapping = normalizeMapping({
      Adults: ['Adults', 'Adult', 'Adults fiction', 'Farsi adults fiction'],
      Kids: ['Kids', 'Teen', 'Farsi kids fiction'],
    })

    for (const tag of entry.tags || []) {
      const m = searchMapping(mapping, tag)
      if (m) {
        return m
      }
    }

    const secondaryMapping = normalizeMapping({
      Adults: ['Dictionary'],
    })
    for (const tag of entry.tags || []) {
      const m = searchMapping(secondaryMapping, tag)
      if (m) {
        return m
      }
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
    const mapping = normalizeMapping({
      'Fiction': ['Fiction', 'Farsi kids fiction', 'Adults Fiction', 'Crime Fiction'],
      'Non fiction': ['Non fiction', 'Health & Fitness', 'Travel', 'Cooking', 'Poetry', 'Magazine'],
      'Educational/sciences': ['Educational/sciences', 'Science', 'Education', 'Geography', 'Nature', 'History', 'Academic', 'Culture', 'Animals', 'Encyclopedia', 'Art', 'Creative', 'Religion', 'Handicrafts'],
      'Languages': ['Languages', 'Language Learning', 'Dictionary', 'English Readers'],
    })

    for (const tag of entry.tags || []) {
      const m = searchMapping(mapping, tag)
      if (m) {
        return m
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

  data = Object.values(data)
    // ignore board games
    .filter(entry => {
      const tags = entry.tags || []
      return !tags.includes('Board game') && !tags.includes('Cards')
    })
    .map(entry => {
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
