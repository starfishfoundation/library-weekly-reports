export function transpose(table: any[][]) {
  return table[0].map((_, i) => table.map(row => row[i]))
}

export function tableToHtml(table: any[][]): string {
  return `
    <table>
      ${table.map(row => `
        <tr>
          ${row.map(cell => `
            <td>${cell}</td>
          `).join('')}
        </tr>
      `).join('')}
    </table>
  `
}
