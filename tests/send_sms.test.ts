import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import { AlphaSmsClient } from '../src/client'

describe.skip('integration: sendSms', () => {
  it('returns real sms', async () => {
    const auth = process.env.ALPHASMS_AUTH
    if (!auth) throw new Error('Missing ALPHASMS_AUTH')

    const client = new AlphaSmsClient({ auth })
    const id = Date.now()
    const b = await client.sendSms({
      id,
      phone: 380996195811,
      sms_signature: 'LeadBox',
      sms_message: 'Дякуємо за реєстрацію!',
      hook: 'https://webhook.site/d2bf6298-787b-49f5-8729-1f710d84fa17'
    })

    console.log(id)
    console.log(b)

    expect(typeof b.msg_id).toBe('number')
  })
})
