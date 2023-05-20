let currentAccount = null;
const infoButton = document.getElementById('info-button');
const infoDialog = document.getElementById('info-dialog');
const connectButton = document.getElementById('connect');
const shortUrlInput = document.getElementById('short-url');
const shortUrlAside = document.getElementById('short-url-aside');
const statusOutput = document.getElementById('status');
const form = document.querySelector('form');
const notification = document.getElementById('notification');

// Helper function to call the balanceOf function on an address to check if it's eligible to create
// custom short URLs. The same logic is executed on the backend to independently validate on server-side.
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

// Event handler to update UI elements to reflect the active account
async function setAccount(accounts) {
  // Use the currently active account if multiple accounts are connected
  currentAccount = accounts[0];

  // All accounts disconnected
  if (currentAccount === null || currentAccount === undefined) {
    connectButton.textContent = `Connect${String.fromCharCode(160)}Wallet`; // Char code 160 = non-breaking space
    connectButton.disabled = false;
    shortUrlInput.value = '';
    shortUrlInput.disabled = true;
    shortUrlAside.textContent = 'Connect wallet to enable this feature.';
    return;
  }

  connectButton.textContent = currentAccount;
  connectButton.disabled = true;
  shortUrlAside.textContent = 'Checking your address...';
  const nftCount = await getNftCount(currentAccount);
  if (nftCount > 0) {
    shortUrlAside.textContent = 'Enter a custom short URL.';
    shortUrlInput.disabled = false;
  }
  else {
    shortUrlAside.textContent = 'The required access token was not found in your account.';
    shortUrlInput.value = '';
    shortUrlInput.disabled = true;
  }
}

// Event handler for form submit event
async function handleSubmit(event) {
  event.preventDefault();

  statusOutput.classList.remove('success');
  statusOutput.classList.remove('failure');
  statusOutput.textContent = '';

  const data = new FormData(event.target);
  const shortUrl = data.get('short-url');
  const fullUrl = data.get('full-url');

  if (shortUrl !== '' && shortUrl !== null && shortUrl !== undefined) {
    const message = `Sign this message to confirm you want to create https://alu.bz/${shortUrl} to redirect to ${fullUrl}.`;
    const array = [...new TextEncoder().encode(message)];
    const hex = `0x${array.map(v => v.toString(16).padStart(2, '0')).join('')}`;
    const signature = await ethereum.request({
      method: 'personal_sign',
      params: [hex, currentAccount, '']
    });
    data.set('signature', signature);
  }

  const response = await fetch('/api', {
    method: 'POST',
    body: data
  });

  if (response.ok) {
    statusOutput.classList.add('success');
    const generatedUrl = await response.text();
    statusOutput.innerHTML = `Successfully created short URL: <a href="${location.origin}/${generatedUrl}">${location.origin}/${generatedUrl}</a>`;
  }
  else {
    statusOutput.classList.add('failure');
    statusOutput.textContent = await response.text();
  }
}

if (window.ethereum !== undefined) {
  // User switches account manually in MetaMask
  ethereum.addListener('accountsChanged', setAccount);
}

connectButton.addEventListener('click', () => {
  if (window.ethereum !== undefined) {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(setAccount);
  }
  else {
    notification.show();
  }
});

form.addEventListener('submit', handleSubmit);

infoButton.addEventListener('click', () => {
  infoDialog.showModal();
});
