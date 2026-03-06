import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { SignedFilesResponse } from '~~/shared/types'

export default defineEventHandler((): SignedFilesResponse => {
  const filePath = resolve(process.cwd(), '../mock-data/signedfiles.json')
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
})
