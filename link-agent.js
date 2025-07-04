import { create } from '@web3-storage/w3up-client'

const AGENT_KEY_FILE = './agent-key.json'

const main = async () => {
  const client = await create()
  const spaceDID = 'did:key:z6Mkp1SKAQwFLwxWjHVbGLEQTKcHrqM9TkwNw2kiKf6aV3mi' 

  console.log('🪪 Linking to space:', spaceDID)

  await client.login(/* optional email-based login */)
  const space = await client.setCurrentSpace(spaceDID)

  // Save your new agent key
  const agent = await client.export()
  const fs = await import('fs')
  fs.writeFileSync(AGENT_KEY_FILE, JSON.stringify(agent, null, 2))

  console.log('✅ Agent key saved to', AGENT_KEY_FILE)
}

main().catch(console.error)
