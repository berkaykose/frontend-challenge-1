import type { ChunkRequest, DeleteResult } from '~~/shared/types'

export default defineEventHandler(async (event): Promise<DeleteResult> => {
  const body = await readBody<ChunkRequest>(event)
  const count = body.dates.length

  return {
    processedFileIds: body.dates.map((_, i) => `f${i + 1}`),
    failedFileIds: [],
    status: 'completed',
    additionalInfo: `${count} file${count !== 1 ? 's' : ''} deleted successfully`,
  }
})
