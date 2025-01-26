const { ethers } = require("ethers")
require('dotenv').config({ path: '../.env' })
const axios = require('axios')
const { Web3 } = require('web3')

let quote
let assembledTransaction

const quoteUrl = 'https://api.odos.xyz/sor/quote/v2';

async function getQuote(quoteRequestBody) {
    try {
        const response = await axios.post(quoteUrl, quoteRequestBody, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000, // 10 seconds timeout
        });

        if (response.status === 200) {
            quote = response.data;
            console.log('Quote:', quote);
        } else {
            console.error('Error in Quote:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

const assembleUrl = 'https://api.odos.xyz/sor/assemble';

async function getAssemble(assembleRequestBody) {
    try {
        const response = await axios.post(assembleUrl, assembleRequestBody, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000, // 10 seconds timeout
        });

        if (response.status === 200) {
            assembledTransaction = response.data;
            console.log('Assembled Transaction:', assembledTransaction);
        } else {
            console.error('Error in Transaction Assembly:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

async function sendTransaction() {
    // 1. create web3 provider
    const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);

    // 2. Extract transaction object from assemble API response
    const transaction = assembledTransaction.transaction;

    let txHash;
    // 3a. Sign transaction with a web3 provider / wallet
    txHash = await web3.eth.accounts.signTransaction(transaction);
    console.log(txHash)

    // 3b. sign transaction with private key
    const pk = process.env.PRIVATE_KEY_0
    const signedTx = web3.eth.accounts.signTransaction(transaction, pk)
    console.log(signedTx)
    txHash = await web3.eth.send_raw_transaction(signedTx.rawTransaction)
}

async function main() {
    const quoteRequestBody = {
        chainId: 1, // Replace with desired chainId
        inputTokens: [
            {
                tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // checksummed input token address
                amount: ethers.parseEther("0.01").toString(), // input amount as a string in fixed integer precision
            }
        ],
        outputTokens: [
            {
                tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // checksummed output token address
                proportion: 1
            }
        ],
        userAddr: '0x551F08A03B2E7A192C97F44456b5CB2dC71F4393', // checksummed user address
        slippageLimitPercent: 0.3, // set your slippage limit percentage (1 = 1%),
        referralCode: 0, // referral code (recommended)
        disableRFQs: true,
        compact: true,
    };

    await getQuote(quoteRequestBody)

    const assembleRequestBody = {
        userAddr: '0x551F08A03B2E7A192C97F44456b5CB2dC71F4393', // the checksummed address used to generate the quote
        pathId: quote.pathId, // Replace with the pathId from quote response in step 1
        simulate: true, // this can be set to true if the user isn't doing their own estimate gas call for the transaction
    };

    await getAssemble(assembleRequestBody)
    await sendTransaction()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});