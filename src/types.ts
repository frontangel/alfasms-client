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

export type SendSmsParams = {
  id: number
  phone: number
  sms_signature: string
  sms_message: string
  sms_lifetime?: number
  short_link?: boolean
  unsubscribe_link?: boolean
  hook?: string
}

export type SendSmsSuccessData = {
  id: number
  msg_id: number
  data: number
  parts: number
}

export type SendSmsErrorData = {
  id: number
}

export type SendSmsResult = SendSmsSuccessData


export type MessageType = 'sms' | 'viber' | 'rcs'

export type MessageStatusResult = {
  id: number
  type: MessageType
  status: string
}
