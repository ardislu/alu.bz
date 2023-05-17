// From "ethers/hash" v6.1.0
import { verifyMessage } from './verifyMessage';

// Same function used on the frontend, ran again to verify.
async function getNftCount(address) {
  // Hardcoded parameters to query the Ethereum smart contract
  const contractAddress = '0x74EE68a33f6c9f113e22B3B77418B75f85d07D22'; // Zerion ERC-1155 NFT 
  const byteSignature = '00fdd58e'; // Ethereum ABI function signature for: balanceOf(address, uint256)
  const paddedAddress = address.substring(2).padStart(64, '0');
  const nftId = '5'.padStart(64, '0'); // Arbitrary ID for the ERC-1155 NFT to look up

  // Prepare and send the payload to an Ethereum JSON-RPC node
  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_call',
    params: [
      {
        to: contractAddress,
        data: `0x${byteSignature}${paddedAddress}${nftId}`
      },
      'latest'
    ]
  }
  return fetch('https://eth.alu.bz/v1/mainnet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(json => json['result'])
    .then(result => parseInt(result, 16));
}

export async function onRequestPost({ request, env }) {
  const data = await request.formData();
  let shortUrl = data.get('short-url');
  const fullUrl = data.get('full-url');
  const signature = data.get('signature');
  let isRandomlyGenerated = false;

  // Generate random 4 character shortUrl if none is provided
  if (shortUrl === '' || shortUrl === null || shortUrl === undefined) {
    isRandomlyGenerated = true;
    do {
      let array = new Uint32Array(4);
      crypto.getRandomValues(array);
      shortUrl = [...array].map(v => (v % 36).toString(36)).join('');
    } while (await env.links.get(shortUrl) !== null); // Confirm it's not already taken
  }
  // Invalid short URLs
  else if (!/^[0-9a-zA-Z-_]*$/g.test(shortUrl) || shortUrl === 'api') {
    return new Response('Invalid short URL', { status: 400, headers: { 'Content-Type': 'text/plain; charset=UTF-8' } });
  }
  // User-provided duplicates
  else if (await env.links.get(shortUrl) !== null) {
    return new Response('This short URL is already taken', { status: 400, headers: { 'Content-Type': 'text/plain; charset=UTF-8' } });
  }

  // Invalid full URLs
  try {
    new URL(fullUrl);
  }
  catch (error) {
    return new Response('Invalid full URL', { status: 400, headers: { 'Content-Type': 'text/plain; charset=UTF-8' } });
  }

  if (!isRandomlyGenerated) {
    if (shortUrl.length > 80) {
      return new Response('The short URL is too long (maximum length is 80 characters).', { status: 400, headers: { 'Content-Type': 'text/plain; charset=UTF-8' } });
    }
    const message = `Sign this message to confirm you want to create https://alu.bz/${shortUrl} to redirect to ${fullUrl}.`; // Must match frontend exactly
    const signingAddress = verifyMessage(message, signature);
    const nftCount = await getNftCount(signingAddress);
    if (!(nftCount > 0)) {
      return new Response('Invalid signature', { status: 403, headers: { 'Content-Type': 'text/plain; charset=UTF-8' } });
    }
  }

  await env.links.put(shortUrl, fullUrl);
  return new Response(`Successfully created short URL: https://alu.bz/${shortUrl}`, { headers: { 'Content-Type': 'text/plain; charset=UTF-8' } });
}
