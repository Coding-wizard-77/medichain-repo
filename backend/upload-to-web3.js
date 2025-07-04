import fs from 'fs';
import { File } from 'web3.storage';
import { createClient } from '@web3-storage/w3up-client';
import * as ucan from '@web3-storage/access/ucan';

export async function uploadToWeb3Storage(filePath, fileName) {
const client = await createClient();

const proof = JSON.parse(fs.readFileSync('./proof.ucan', 'utf-8'));
await client.addProof(ucan.Delegation.import(proof));

const space = await client.setCurrentSpace(proof.att[0].with);
const fileBuffer = fs.readFileSync(filePath);
const file = new File([fileBuffer], fileName);

const cid = await client.uploadFile(file);
return "https://w3s.link/ipfs/${cid}";
}