export interface ChunkDate {
  year: number
  month: number
  day: number
  hour: number
  minute?: number
}

export interface Bucket {
  date: ChunkDate
  dataChunkCount: number
  sizeOnDisk: number
  compressedBytes: number
  uncompressedBytes: number
  compressionRatio: number
  dataCount: number
}

export interface ChunkGroup {
  date: ChunkDate
  buckets: Bucket[]
  dataChunkCount: number
  sizeOnDisk: number
  compressedBytes: number
  uncompressedBytes: number
  compressionRatio: number
  dataCount: number
}

export interface SignedFilesResponse {
  groups: ChunkGroup[]
  dataChunkCount: number
  sizeOnDisk: number
  compressedBytes: number
  uncompressedBytes: number
  compressionRatio: number
  dataCount: number
  minDataCount: number
  maxDataCount: number
  minByte: number
  maxByte: number
}

export interface DownloadFile {
  fileId: string
  fileName: string
  downloadUrl: string
  expirationDate: string
  fileSize: number
}

export interface DeleteResult {
  processedFileIds: string[]
  failedFileIds: string[]
  status: string
  additionalInfo: string
}

export interface ChunkRequest {
  dates: ChunkDate[]
}
