export type AlphaSmsRequestItem = { type: string } & Record<string, any>

export type AlphaSmsResponseItem<T> = {
  success: boolean
  data?: T
  error?: string
}

export type AlphaSmsEnvelope<T> = {
  success: boolean
  data?: Array<AlphaSmsResponseItem<T>>
  error?: string
}

export type BalanceData = {
  amount: number
  currency: string
}
