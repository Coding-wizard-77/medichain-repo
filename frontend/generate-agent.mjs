import { create } from '@web3-storage/w3up-client'
import fs from 'fs'

const UCAN_FILE = './medichain-space-access.ucan'
const AGENT_FILE = './agent-key.json'
const SPACE_DID = 'did:key:z...your_space_did_here'  // replace with your actual space DID

async function main() {
  const client = await create()

  // Load the UCAN you downloaded from Storacha
  const ucan = fs.readFileSync(UCAN_FILE, 'utf-8').trim()
  await client.addProof(ucan)

  // Connect to your space
  await client.setCurrentSpace(SPACE_DID)

  // Export the agent for reuse in your frontend
  const agent = await client.export()
  fs.writeFileSync(AGENT_FILE, JSON.stringify(agent, null, 2))

  console.log('✅ Agent connected to space and saved to agent-key.json')
}

main().catch(console.error)
