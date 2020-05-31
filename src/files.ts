interface HTMLInputElement {
  addEventListener(type: 'change', listener: (e: Event & { target: HTMLInputElement & EventTarget }) => any): void
}

function openTextFiles(options: { accept?: string; multiple?: boolean }) {
  return new Promise<Array<{ file: File; content: string | null }>>((resolve, reject) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.style.display = 'none'
    fileInput.accept = typeof options?.accept === 'undefined' ? '*' : options.accept
    fileInput.multiple = typeof options?.multiple === 'undefined' ? false : options.multiple

    fileInput.addEventListener('change', (e) => {
      const files = e.target.files
      if (files === null) return reject()

      const promises: Array<Promise<{ file: File; content: string | null }>> = []
      for (const file of files) {
        promises.push(
          new Promise<{ file: File; content: string | null }>((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
              resolve({ file, content: reader.result as string | null })
            })
            reader.readAsText(file)
          })
        )
      }

      Promise.all(promises).then((value) => {
        document.body.removeChild(fileInput)
        resolve(value)
      })
    })

    document.body.appendChild(fileInput)
    fileInput.click()
  })
}
