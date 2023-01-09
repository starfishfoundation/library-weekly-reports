import { Connection, DATA_TYPE } from 'jsstore'

const schema = {
  name: 'libraryWeeklyReports',
  tables: [
    {
      name: 'Book',
      columns: {
        id: { primaryKey: true, dataType: DATA_TYPE.String },
        title: { dataType: DATA_TYPE.String },
        language: { dataType: DATA_TYPE.String },
        audience: { dataType: DATA_TYPE.String },
        topic: { dataType: DATA_TYPE.String },
        errors: { dataType: DATA_TYPE.Array },
      },
    },
    {
      name: 'Transaction',
      columns: {
        id: { primaryKey: true, autoIncrement: true },
        bookId: { notNull: true, dataType: DATA_TYPE.String },
        status: { notNull: true, dataType: DATA_TYPE.String },
        entryDate: { notNull: true, dataType: DATA_TYPE.DateTime },
        errors: { dataType: DATA_TYPE.Array },
      },
    },
    {
      name: 'Import',
      columns: {
        id: { primaryKey: true, dataType: DATA_TYPE.String },
        lastModified: { notNull: true, dataType: DATA_TYPE.DateTime },
      },
    },
  ],
}

let connection: Connection | null = null
async function getInstance() {
  if (!connection) {
    const w = new Worker(new URL('jsstore/dist/jsstore.worker.js', import.meta.url))
    connection = new Connection(w)
    await connection.initDb(schema)
  }
  return connection
}

export default { schema, getInstance }
