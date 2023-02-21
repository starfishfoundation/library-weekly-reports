import db from '~/db'
import { getDate, getDateExcelFormat, getDayName, getNextDate } from '~/utils/time'

interface ReportParams {
  dateFrom: Date;
  dateTo: Date;
}

interface DayReport {
  date: string;
  entries: any[];
  status: { [k: string]: number };
  language: { [k: string]: number };
  audience: { [k: string]: number };
  topic: { [k: string]: number };
}

const defaultDayReport: Partial<DayReport> = {
  status: {
    'Checked out': 0,
    'Returned': 0,
    'Renewed': 0,
    'New patron': 0,
  },
  language: {
    Farsi: 0,
    Arabic: 0,
    Somali: 0,
    French: 0,
    English: 0,
    German: 0,
    Greek: 0,
    Amharic: 0,
    Other: 0,
  },
  audience: {
    Adults: 0,
    Kids: 0,
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

class SheetMaker {
  ROWS = 35

  cells: (number | string)[][] = []
  _partialIdxs: number[] = []

  addColumn(data: (number | string)[]): number {
    if (data.length !== this.ROWS) {
      throw new Error(`Expected ${this.ROWS} values but received ${data.length} instead`)
    }

    return this.cells.push(data)
  }

  addDataColumn(data: (number | string)[]): number {
    return this.addColumn(data)
  }

  addEmptyColumn() {
    return this.addColumn(Array(35).fill(''))
  }

  _addFormulaColumn(title: string, formula: string) {
    return this.addColumn([
      '',
      title,
      formula,
      '',
      '',
      formula,
      '',
      formula,
      '',
      formula,
      '',
      '',
      '',
      formula,
      formula,
      formula,
      formula,
      formula,
      formula,
      formula,
      formula,
      formula,
      '',
      '',
      '',
      formula,
      formula,
      '',
      '',
      '',
      formula,
      formula,
      formula,
      formula,
      formula,
    ])
  }

  addPartialSumColumn(title: string) {
    let sumFormula = ''
    if (this.cells.length) {
      // if there is no previous partial, get all cells
      let nLookBehind = this.cells.length
      // if there is, get last partial index and subtract to get the look behind amount
      nLookBehind -= this._partialIdxs.length ? this._partialIdxs[this._partialIdxs.length - 1] : 0
      sumFormula = `=SUM(INDIRECT("R[0]C[-${nLookBehind}]:R[0]C[-1]"; FALSE))`
    }

    const idx = this._addFormulaColumn(title, sumFormula)
    this._partialIdxs.push(idx)
    return idx
  }

  addTotalSumColumn(title: string) {
    const sumFormulas = []
    let lastIdx = 0
    for (const idx of this._partialIdxs) {
      sumFormulas.push(
        `SUM(INDIRECT("R[0]C[-${this.cells.length - lastIdx}]:R[0]C[-${this.cells.length - idx + 2}]"; FALSE))`,
      )
      lastIdx = idx
    }

    if (lastIdx < this.cells.length) {
      sumFormulas.push(
        `SUM(INDIRECT("R[0]C[-${this.cells.length - lastIdx}]:R[0]C[-1]"; FALSE))`,
      )
    }

    const sumFormula = `=${sumFormulas.join(' + ')}`
    return this._addFormulaColumn(title, sumFormula)
  }
}

export function prepareReport(params: ReportParams, data) {
  if (!data.length) {
    return []
  }

  const perDate: { [date: string]: DayReport } = {}

  // Step 1: Group by date
  data.forEach((entry) => {
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
    v.entries.forEach((entry) => {
      if (typeof v.status[entry.status] === 'undefined') {
        v.status[entry.status] = 0
      }
      v.status[entry.status]++

      if (entry.status === 'Checked out') {
        // further stats are only for check-outs
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
      }
    })
  }

  // Step 3: Fill dates in-between
  const dayReports: DayReport[] = []
  const dateFirst = getDate(params.dateFrom)
  const dateLast = getDate(params.dateTo)
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
  const sheet = new SheetMaker()
  const getWeekDay = (dayReport) => {
    const wd = new Date(dayReport.date).getDay()
    return wd === 0 ? 7 : wd
  }
  let prevWeekDay = 0

  dayReports.forEach((dr) => {
    const d = new Date(dr.date)
    if (getWeekDay(dr) < prevWeekDay) {
      sheet.addPartialSumColumn('Week total')
      sheet.addEmptyColumn()
    }

    if (dr.entries.length) {
      sheet.addDataColumn([
        getDateExcelFormat(d),
        getDayName(d),
        dr.status['Checked out'] || 0,
        '',
        '',
        dr.status.Returned || 0,
        '',
        dr.status.Renewed || 0,
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
        dr.topic.Fiction || 0,
        dr.topic['Non fiction'] || 0,
        dr.topic['Educational/sciences'] || 0,
        dr.topic.Languages || 0,
        dr.topic.Other || 0,
      ])
    } else if (getWeekDay(dr) <= 5) {
      sheet.addDataColumn([
        getDateExcelFormat(d),
        getDayName(d),
        0,
        ...Array(32).fill(''),
      ])
    }

    prevWeekDay = getWeekDay(dr)
  })

  sheet.addPartialSumColumn('Week total')
  sheet.addEmptyColumn()

  sheet.addTotalSumColumn('Total')

  return sheet.cells
}

export async function exportReport(params: ReportParams) {
  const q = prepareQuery(params)

  const conn = await db.getInstance()
  const data = await conn.select(q)

  const report = prepareReport(params, data)

  return report
}
