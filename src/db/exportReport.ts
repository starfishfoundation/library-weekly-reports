import db from '~/db'
import { getDate, getNextDate, getDayName, getDateExcelFormat } from '~/utils/time'

interface ReportParams {
  dateFrom: Date
  dateTo: Date
}

interface DayReport {
  date: string
  entries: any[]
  status: {[k: string]: number}
  language: {[k: string]: number}
  audience: {[k: string]: number}
  topic: {[k: string]: number}
}

const defaultDayReport: Partial<DayReport> = {
  status: {
    'Checked out': 0,
    'Returned': 0,
    'Renewed': 0,
    'New patron': 0,
  },
  language: {
    'Farsi': 0,
    'Arabic': 0,
    'Somali': 0,
    'French': 0,
    'English': 0,
    'German': 0,
    'Greek': 0,
    'Amharic': 0,
    'Other': 0,
  },
  audience: {
    'Adults': 0,
    'Kids': 0,
  },
  topic: {
    'Fiction': 0,
    'Non fiction': 0,
    'Educational/sciences': 0,
    'Languages': 0,
    'Other': 0,
  },
}

export function prepareQuery(params: ReportParams) {
  return {
    from: 'Transaction',
    join: {
      with: 'Book',
      on: 'Book.id=Transaction.bookId',
      as: {
        id: 'bookId',
        errors: 'bookErrors',
      },
    },
    where: {
      entryDate: {
        '-': {
          low: params.dateFrom,
          high: params.dateTo,
        },
      },
    },
    order: {
      by: 'Transaction.entryDate',
      type: 'asc',
    },
  }
}

export function prepareReport(params: ReportParams, data) {
  if (!data.length) {
    return []
  }

  const perDate: {[date: string]: DayReport} = {}

  // Step 1: Group by date
  data.forEach(entry => {
    const date = getDate(entry.entryDate)
    perDate[date] = perDate[date] || {
      date,
      entries: [],
      ...structuredClone(defaultDayReport),
    }
    perDate[date].entries.push(entry)
  })

  // Step 2: Calculate counts for each date
  for (const v of Object.values(perDate)) {
    v.entries.forEach(entry => {
      if (typeof v.status[entry.status] === 'undefined') {
        v.status[entry.status] = 0
      }
      v.status[entry.status]++

      if (typeof v.language[entry.language] === 'undefined') {
        v.language[entry.language] = 0
      }
      v.language[entry.language]++

      if (typeof v.audience[entry.audience] === 'undefined') {
        v.audience[entry.audience] = 0
      }
      v.audience[entry.audience]++

      if (typeof v.topic[entry.topic] === 'undefined') {
        v.topic[entry.topic] = 0
      }
      v.topic[entry.topic]++
    })
  }

  // Step 3: Fill dates in-between
  const dayReports: DayReport[] = []
  const dateFirst = Object.values(perDate)[0].date
  const dateLast = Object.values(perDate)[Object.keys(perDate).length - 1].date
  let date = dateFirst
  while (true) {
    if (perDate[date]) {
      dayReports.push(perDate[date])
    } else {
      dayReports.push({
        date,
        entries: [],
        ...structuredClone(defaultDayReport),
      } as DayReport)
    }

    if (date === dateLast) {
      break
    }

    // go to next date
    date = getDate(getNextDate(date))
  }

  // Step 4: Convert to cells
  const cells: any[] = []
  const getWeekDay = dayReport => {
    let wd = new Date(dayReport.date).getDay()
    return wd === 0 ? 7 : wd
  }
  let prevWeekDay = 0
  dayReports.forEach(dr => {
    const d = new Date(dr.date)
    if (getWeekDay(dr) < prevWeekDay) {
      cells.push(Array(35).fill(''))
    }

    if (dr.entries.length) {
      cells.push([
        getDateExcelFormat(d),
        getDayName(d),
        dr.status['Checked out'] || 0,
        '',
        '',
        dr.status['Returned'] || 0,
        '',
        dr.status['Renewed'] || 0,
        '',
        dr.status['New patron'] || 0,
        '',
        '',
        '',
        dr.language.Farsi || 0,
        dr.language.Arabic || 0,
        dr.language.Somali || 0,
        dr.language.French || 0,
        dr.language.English || 0,
        dr.language.German || 0,
        dr.language.Greek || 0,
        dr.language.Amharic || 0,
        dr.language.Other || 0,
        '',
        '',
        '',
        dr.audience.Kids || 0,
        dr.audience.Adults || 0,
        '',
        '',
        '',
        dr.topic['Fiction'] || 0,
        dr.topic['Non fiction'] || 0,
        dr.topic['Educational/sciences'] || 0,
        dr.topic['Languages'] || 0,
        dr.topic['Other'] || 0,
      ])
    } else if (getWeekDay(dr) <= 5) {
      cells.push([
        getDateExcelFormat(d),
        getDayName(d),
        0,
        ...Array(32).fill(''),
      ])
    }

    prevWeekDay = getWeekDay(dr)
  })

  return cells
}

export async function exportReport(params: ReportParams) {
  const q = prepareQuery(params)

  const conn = await db.getInstance()
  const data = await conn.select(q)

  const report = prepareReport(params, data)

  return report
}
