import { create } from '@web3-storage/w3up-client'
import fs from 'fs'

const SPACE_DID = 'did:key:z6Mkp1SKAQwFLwxWjHVbGLEQTKcHrqM9TkwNw2kiKf6aV3mi' // Your actual Medichain space DID
const AGENT_KEY_FILE = './agent-key.json'
const UCAN_FILE = './medichain-space-access.ucan'

const main = async () => {
  const client = await create()

  // Load your UCAN delegation (text file with base64 string)
  const ucan = fs.readFileSync(UCAN_FILE, 'utf-8').trim()
  await client.addProof(ucan)

  // Set current space
  await client.setCurrentSpace(SPACE_DID)

  // Export agent key for app use
  const agent = await client.export()
  fs.writeFileSync(AGENT_KEY_FILE, JSON.stringify(agent, null, 2))

  console.log('✅ Linked and saved agent key to agent-key.json')
}

main().catch(console.error)

