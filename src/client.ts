import { AlphaSmsError } from './errors.js'
import type {
  AlphaSmsEnvelope,
  AlphaSmsRequestItem,
  BalanceData,
  SendSmsParams,
  SendSmsResult,
  SendSmsSuccessData
} from './types.js';

export type AlphaSmsClientOptions = {
  auth: string
  baseUrl?: string // default: https://alphasms.ua/api/json.php
  timeoutMs?: number // default: 15000
}

export class AlphaSmsClient {
  private auth: string
  private url: string
  private timeoutMs: number

  constructor(opts: AlphaSmsClientOptions) {
    if (!opts?.auth) throw new AlphaSmsError('AlphaSMS auth key is required', { code: 'CONFIG' })
    this.auth = opts.auth
    this.url = opts.baseUrl ?? 'https://alphasms.ua/api/json.php'
    this.timeoutMs = opts.timeoutMs ?? 15_000
  }

  async request<T>(items: AlphaSmsRequestItem[]): Promise<AlphaSmsEnvelope<T>> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ auth: this.auth, data: items }),
        signal: controller.signal
      })

      const text = await res.text()
      const json = text ? safeJsonParse(text) : null

      if (!res.ok) {
        throw new AlphaSmsError('HTTP error from AlphaSMS', {
          code: 'HTTP_ERROR',
          status: res.status,
          details: json ?? { text }
        })
      }

      if (!json || typeof json !== 'object') {
        throw new AlphaSmsError('Invalid response from AlphaSMS', { code: 'BAD_RESPONSE', details: { text } })
      }

      if (json.success === false) {
        throw new AlphaSmsError(json.error ?? 'AlphaSMS error', { code: 'API_ERROR', details: json })
      }

      return json as AlphaSmsEnvelope<T>
    } catch (e: any) {
      if (e?.name === 'AbortError') throw new AlphaSmsError('AlphaSMS request timeout', { code: 'TIMEOUT' })
      if (e instanceof AlphaSmsError) throw e
      throw new AlphaSmsError(e?.message ?? 'Unknown error', { code: 'UNKNOWN', details: e })
    } finally {
      clearTimeout(timer)
    }
  }

  async balance(): Promise<BalanceData> {
    const env = await this.request<BalanceData>([{ type: 'balance' }])

    const item = env.data?.[0]
    if (!item) {
      throw new AlphaSmsError('Missing balance item', { code: 'BAD_RESPONSE', details: env })
    }
    if (item.success === false) {
      throw new AlphaSmsError(item.error ?? 'AlphaSMS balance failed', { code: 'API_ITEM_ERROR', details: item })
    }

    const data = item.data
    if (!data || typeof data.amount !== 'number' || typeof data.currency !== 'string') {
      throw new AlphaSmsError('Unexpected balance data shape', { code: 'BAD_RESPONSE', details: env })
    }

    return data
  }

  async sendSms(params: SendSmsParams): Promise<SendSmsResult> {
    const payload = {
      type: 'sms',
      ...params
    }

    const env = await this.request<SendSmsSuccessData>([payload])

    // top-level success=false
    if (env.success === false) {
      throw new AlphaSmsError(env.error ?? 'AlphaSMS access denied', {
        code: 'API_ERROR',
        details: env
      })
    }

    const item = env.data?.[0]

    if (!item) {
      throw new AlphaSmsError('Missing sendSms response item', {
        code: 'BAD_RESPONSE',
        details: env
      })
    }

    // data.success=false (наприклад "Error in Alpha-name")
    if (item.success === false) {
      throw new AlphaSmsError(item.error ?? 'AlphaSMS sendSms failed', {
        code: 'API_ITEM_ERROR',
        details: item
      })
    }

    const data = item.data

    if (
    !data ||
    typeof data.id !== 'number' ||
    typeof data.msg_id !== 'number' ||
    typeof data.parts !== 'number'
    ) {
      throw new AlphaSmsError('Unexpected sendSms response structure', {
        code: 'BAD_RESPONSE',
        details: env
      })
    }

    return data
  }
}

function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text)
  } catch {
    throw new AlphaSmsError('Invalid JSON response from AlphaSMS', { code: 'BAD_RESPONSE', details: { text } })
  }
}
