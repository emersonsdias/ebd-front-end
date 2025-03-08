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
}
