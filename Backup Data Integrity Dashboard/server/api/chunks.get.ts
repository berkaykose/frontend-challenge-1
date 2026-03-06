import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import type { SignedFilesResponse } from '~~/shared/types'

const mockDataDir = fileURLToPath(new URL('../../../mock-data', import.meta.url))

export default defineEventHandler((): SignedFilesResponse => {
  const raw = readFileSync(resolve(mockDataDir, 'signedfiles.json'), 'utf-8')
  return JSON.parse(raw)
})
