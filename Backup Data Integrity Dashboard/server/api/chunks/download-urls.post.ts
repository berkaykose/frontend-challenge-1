import type { ChunkRequest, DownloadFile } from '../../../shared/types'

export default defineEventHandler(async (event): Promise<DownloadFile[]> => {
  const body = await readBody<ChunkRequest>(event)

  const expiration = new Date()
  expiration.setDate(expiration.getDate() + 2)

  return body.dates.map((d, i) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const fileName = `chunk_${d.year}_${pad(d.month)}_${pad(d.day)}_${pad(d.hour)}_${pad(d.minute ?? 0)}.dat`
    const fileSize = Math.floor(Math.random() * (209888 - 89808 + 1)) + 89808

    return {
      fileId: `f${i + 1}`,
      fileName,
      downloadUrl: `https://storage.example.com/signed/${fileName}?token=mock&expires=${Math.floor(expiration.getTime() / 1000)}`,
      expirationDate: expiration.toISOString(),
      fileSize,
    }
  })
})
