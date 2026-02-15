# AlphaSMS Client

[![npm version](https://img.shields.io/npm/v/alphasms-client.svg)](https://www.npmjs.com/package/alphasms-client)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![node](https://img.shields.io/node/v/alphasms-client.svg)](https://www.npmjs.com/package/alphasms-client)
[![stars](https://img.shields.io/github/stars/frontangel/alfasms-client?style=social)](https://github.com/YOUR_GITHUB_USERNAME/alphasms-client)


Lightweight, strongly-typed TypeScript client for the AlphaSMS JSON API.

Designed for Node.js services and NestJS backends.

---

## ✨ Features

- TypeScript support
- Promise-based API
- Strongly-typed responses
- Built-in timeout handling
- Structured error handling
- ESM + CJS support

---

## 📦 Installation

```bash
npm install alphasms-client
```

Or with scope:

```bash
npm install @leadbox/alphasms-client
```

---

## 🔑 Usage

### Basic Example (Node.js)

```ts
import { AlphaSmsClient } from 'alphasms-client'

const client = new AlphaSmsClient({
  auth: process.env.ALPHASMS_AUTH
})

const balance = await client.balance()

console.log(balance.amount, balance.currency)
```

### Send SMS

```ts
const result = await client.sendSms({
  id: 100500,
  phone: 380971234567,
  sms_signature: 'SMSTest',
  sms_message: 'Hello from AlphaSMS',
  sms_lifetime: 172800,
  short_link: true,
  unsubscribe_link: true,
  hook: 'https://example.org/webhook/url.php'
})

console.log(result.msg_id)
````



---

### With dotenv

```bash
npm install dotenv
```

```js
import 'dotenv/config'
import { AlphaSmsClient } from 'alphasms-client'

const client = new AlphaSmsClient({
  auth: process.env.ALPHASMS_AUTH
})

const balance = await client.balance()
console.log(balance)
```

---

## 🏗 NestJS Example

```ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AlphaSmsClient } from 'alphasms-client'

@Injectable()
export class AlphaSmsService {
  private client: AlphaSmsClient

  constructor(private config: ConfigService) {
    this.client = new AlphaSmsClient({
      auth: this.config.getOrThrow<string>('ALPHASMS_AUTH')
    })
  }

  balance() {
    return this.client.balance()
  }
}
```

---

## 📘 API

### new AlphaSmsClient(options)

| Option    | Type   | Required | Default                          |
|-----------|--------|----------|----------------------------------|
| auth      | string | Yes      | –                                |
| baseUrl   | string | No       | https://alphasms.ua/api/json.php |
| timeoutMs | number | No       | 15000                            |

---

### client.balance()

Returns:

```ts
{
  amount: number
  currency: string
}
```

---

## ❗ Error Handling

All errors throw AlphaSmsError.

```ts
import { AlphaSmsError } from 'alphasms-client'

try {
  await client.balance()
} catch (error) {
  if (error instanceof AlphaSmsError) {
    console.error(error.code)
    console.error(error.message)
  }
}
```

Error codes:

- CONFIG
- HTTP_ERROR
- API_ERROR
- API_ITEM_ERROR
- BAD_RESPONSE
- TIMEOUT
- UNKNOWN

---

## 🔒 Security

Do not expose your API auth key in frontend applications.

Use this client only in backend services (Node.js, NestJS, etc).

---

## 🧪 Development

```bash
npm install
npm run build
```

---

## 📜 License

MIT


## 📘 Official Documentation

AlphaSMS JSON API: https://docs.alphasms.ua/api/json/
