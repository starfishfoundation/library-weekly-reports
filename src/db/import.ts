import db from '~/db'

export async function getImport(id: string) {
  const conn = await db.getInstance()
  let res = await conn.select({
    from: 'Import',
    where: { id },
  })

  if (res?.length) {
    return res[0]
  }

  return null
}
