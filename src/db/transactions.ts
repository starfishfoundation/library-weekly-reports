import Papa from 'papaparse'
import db from '~/db'
import { getImport } from '~/db/import'

interface ImportParams {
  lastModified?: Date
}

export async function parseTransactions(file) {
  let data = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  }).data

  data = data.map(entry => {
    return {
      bookId: entry['Item #'],
      status: entry['Item Status'],
      entryDate: new Date(entry['Item Entry date']),
    }
  })

  return data
}

export async function importTransactions(file, params) {
  const conn = await db.getInstance()
  await conn.remove({
    from: 'Transaction',
  })
  await conn.insert({
    into: 'Transaction',
    values: await parseTransactions(file),
  })

  if (params.lastModified) {
    await conn.insert({
      into: 'Import',
      values: [{
        id: 'Transaction',
        lastModified: params.lastModified,
      }]
    })
  }
}

export async function getExistingTransactionInfo() {
  const conn = await db.getInstance()
  const count = await conn.count({
    from: 'Transaction',
  })

  if (!count) {
    return null
  }

  const lastImport = await getImport('Transaction')

  return {
    count,
    lastModified: lastImport?.lastModified,
  }
}
