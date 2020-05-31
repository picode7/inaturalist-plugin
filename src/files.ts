interface HTMLInputElement {
  addEventListener(type: 'change', listener: (e: Event & { target: HTMLInputElement & EventTarget }) => any): void
}

function openTextFile(callback: (file: File, content: any) => any, accept = '*') {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = accept
  fileInput.style.display = 'none'
  fileInput.addEventListener('change', (e) => {
    const files = e.target.files
    if (files === null) return
    const file = files[0]
    if (typeof file === 'undefined') return

    const reader = new FileReader()
    reader.addEventListener('load', (eLoad) => {
      const contents = eLoad.target?.result
      callback(file, contents)
      document.body.removeChild(fileInput)
    })
    reader.readAsText(file)
  })
  document.body.appendChild(fileInput)
  fileInput.click()
}
