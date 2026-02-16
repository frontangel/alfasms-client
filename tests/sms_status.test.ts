import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import { AlphaSmsClient } from '../src/client'

describe('integration: status', () => {
  it('sms status', async () => {
    const id = 1771259723591 // client message id
    const auth = process.env.ALPHASMS_AUTH
    if (!auth) throw new Error('Missing ALPHASMS_AUTH')

    const client = new AlphaSmsClient({ auth })
    const b = await client.getStatus(id)

    expect(b.id).toBe(id.toString())
  })
})
