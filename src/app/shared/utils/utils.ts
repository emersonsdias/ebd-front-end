import { Observable, take } from "rxjs";

export class Utils {

  static downloadPdf(fileName: string, observable: Observable<Blob>): void {
    observable.pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      },
      error: (err) => {
        console.error('Error to file download:', err)
      }
    })
  }

  static isToday(date: Date | string | undefined): boolean {
    if (!date) {
      return false
    }
    if (typeof date === 'string') {
      date = new Date(date)
    }
    const today = new Date()
    today.setHours(0, 0)
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    const dateUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

    return dateUTC.getTime() === todayUTC.getTime()
  }

  static isPast(date: Date | string | undefined): boolean {
    if (!date) {
      return false
    }
    if (typeof date === 'string') {
      date = new Date(date)
    }

    const today = new Date()
    today.setHours(0, 0)
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    const dateUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

    return dateUTC.getTime() < todayUTC.getTime()
  }

  static isFuture(date: Date | string | undefined): boolean {
    if (!date) {
      return false
    }
    if (typeof date === 'string') {
      date = new Date(date)
    }

    const today = new Date()
    today.setHours(0, 0)
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    const dateUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

    return dateUTC.getTime() > todayUTC.getTime()
  }

}
