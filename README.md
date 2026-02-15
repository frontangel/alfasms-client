# AlphaSMS Client

## Install
npm i @your-scope/alphasms-client

## Usage (Node/Nest)
import { AlphaSmsClient } from '@your-scope/alphasms-client'

````
const client = new AlphaSmsClient({ auth: process.env.ALPHASMS_AUTH! })
const balance = await client.balance()
console.log(balance)
````
