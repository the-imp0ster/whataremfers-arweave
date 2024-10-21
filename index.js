const Arweave = require('arweave');
const { readFileSync } = require('fs');
const { join } = require('path');

// initialize the connection to arweave
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
});

async function uploadFile(filePath) {
    // provide keys
    const wallet = JSON.parse(readFileSync('./arconnect-wallet.json'));

    const data = readFileSync(filePath, 'utf8');

    // create the transaction with the data and wallet
    const transaction = await arweave.createTransaction({ data }, wallet);

    // let the transaction know the type of content uploaded
    transaction.addTag('Content-Type', 'text/html');

    // sign the transaction and post
    await arweave.transactions.sign(transaction, wallet);
    const response = await arweave.transactions.post(transaction);

    console.log(`File uploaded: ${filePath}`);
    console.log(`Transaction ID: ${transaction.id}`);
    console.log(`Link: https://arweave.net/${transaction.id}`);
    console.log(`Response: ${JSON.stringify(response)}`);

    // provide transaction id for reference
    return transaction.id;
}

async function main() {
 
    const wamPath = join(__dirname, 'alexeviqjivw.html');

    const wamId = await uploadFile(wamPath);

    console.log("wamId: ", wamId);

}

main();
