export class AlphaSmsError extends Error {
  code: string
  status?: number
  details?: unknown

  constructor(message: string, opts?: { code?: string; status?: number; details?: unknown }) {
    super(message)
    this.name = 'AlphaSmsError'
    this.code = opts?.code ?? 'ALPHASMS_ERROR'
    this.status = opts?.status
    this.details = opts?.details
  }
}
