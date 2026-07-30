import api from './axiosInstance'

async function downloadBlob(url, params, filename) {
  const response = await api.get(url, { params, responseType: 'blob' })
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = blobUrl
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(blobUrl)
}

export const downloadCsvReport = (month) =>
  downloadBlob('/reports/csv', { month }, `transactions-${month}.csv`)

export const downloadPdfReport = (month) =>
  downloadBlob('/reports/pdf', { month }, `expense-report-${month}.pdf`)
