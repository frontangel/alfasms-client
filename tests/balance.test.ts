import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import { AlphaSmsClient } from '../src/client'

describe('integration: balance', () => {
  it('returns real balance', async () => {
    const auth = process.env.ALPHASMS_AUTH
    if (!auth) throw new Error('Missing ALPHASMS_AUTH')

    const client = new AlphaSmsClient({ auth })
    const b = await client.balance()

    expect(typeof b.amount).toBe('number')
    expect(typeof b.currency).toBe('string')
  })
})
