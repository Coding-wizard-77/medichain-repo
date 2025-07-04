import { create } from '@web3-storage/w3up-client'

const client = await create()
console.log('export function exists:', typeof client.export === 'function')
