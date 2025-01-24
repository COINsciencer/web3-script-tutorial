// https://docs.flashbots.net/flashbots-auction/quick-start

const { ethers } = require("ethers")
const { FlashbotsBundleProvider, FlashbotsBundleResolution } = require("@flashbots/ethers-provider-bundle")
require('dotenv').config({ path: '../.env' })

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
// const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)
// Sepolia
// const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)
const provider = new ethers.AlchemyProvider("sepolia", process.env.ALCHEMY_SEPOLIA_KEY)

const CHAIN_ID = 11155111 // sepolia

const privateKey = process.env.PRIVATE_KEY_0
const sponsor = new ethers.Wallet(privateKey, provider)

const privateKeyLeaked = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' // localnet account #0
const victim = new ethers.Wallet(privateKeyLeaked, provider) // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

const ERC20ABI = ["function transfer(address,uint256) external"]
const ERC20Interface = new ethers.Interface(ERC20ABI)

const tokenAddress = '0x7D528d5B543ceD2b9bF90801bE0AeaDCF621613D' // AURA

// for flashbots reputation
const authSigner = ethers.Wallet.createRandom();

async function main() {
    // flashbots sepolia rpc
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        // comment the 2 lines below if using mainnet
        'https://relay-sepolia.flashbots.net/', 
        'sepolia'
    )

    // prepare txs
    // send 0.003 ETH to victim
    const tx1 = {
    	signer: sponsor,
    	transaction: {
    		chainId: CHAIN_ID,
    	    type: 2,
    	    to: victim.address,
    	    value: ethers.parseEther("0.02"),
    	    maxFeePerGas: ethers.parseUnits("150", "gwei"),
    	    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
    	} // ethers populated transaction object
    }
    const tx2 = {
    	signer: victim,
    	transaction: {
    		chainId: CHAIN_ID,
    		type: 2,
    		to: tokenAddress,
    		data: ERC20Interface.encodeFunctionData("transfer", [
    			sponsor.address,
    			ethers.parseUnits("1000", 18),
            ]),
            gasLimit: "100000",
            maxFeePerGas: ethers.parseUnits("150", "gwei"),
    	    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
    	}
    }

    // create bundle
    const transactionBundle = [
        tx1,
        tx2,
        // or signed pending tx in mempool
        // {
        //     signedTransaction: SIGNED_ORACLE_UPDATE_FROM_PENDING_POOL // serialized signed transaction hex
        // }
    ]

    // sign bundle
    const signedTransactions = await flashbotsProvider.signBundle(transactionBundle)

    // simulate
    const targetBlockNumber = (await provider.getBlockNumber()) + 1
    const simulation = await flashbotsProvider.simulate(signedTransactions, targetBlockNumber)
    if ("error" in simulation) {
        throw new Error(simulation.error.message)
    } else {
        console.log("simulation success:", simulation)
    }

    // send bundle
    provider.on("block", async (blockNumber) => {
        console.log(`current block #${blockNumber}`)
        const targetBlockNumber = blockNumber + 1;
        const res = await flashbotsProvider.sendRawBundle(signedTransactions, targetBlockNumber)
        // const res = await flashbotsProvider.sendBundle(transactionBundle, targetBlockNumber)
        if ("error" in res) {
    	    throw new Error(res.error.message)
        }
        // check if included in block
        const bundleResolution = await res.wait()
        // included / not included / nonce too high
        if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
            console.log(`included in block #${targetBlockNumber}`)
            console.log(res)
            console.log(await res.receipts())
            process.exit(0);
        } else if (bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
        	console.log(`not included in block #${targetBlockNumber}`);
        } else if (bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
            console.log("nonce too high");
            process.exit(1);
        }
    });

    // send back token to victim
    // const tx = await sponsor.sendTransaction({
    //     to: tokenAddress,
    //     data: ERC20Interface.encodeFunctionData("transfer", [
    //         victim.address,
    //         ethers.parseUnits("1000", 18),
    //     ])
    // });
    // console.log("tx:", tx)
    // const receipt = await tx.wait()
    // console.log("receipt:", receipt)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});