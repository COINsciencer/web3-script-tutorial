const { ethers } = require("ethers")
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const RECIPIENT = "0x3DdfA8eC3052539b6C9549F12cEA2C295cfF5296" // justin sun

const { abi: factoryABI } = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const { abi: pairABI } = require('@uniswap/v2-periphery/build/IUniswapV2Pair.json')
const { abi: routerABI } = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')

const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider)
const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const routerContract =  new ethers.Contract(routerAddress, routerABI, provider)

const ERC20ABI = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
    "function transfer(address _to, uint256 _value) public returns (bool success)",
    "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)"
]

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const WETHContract = new ethers.Contract(WETH_ADDRESS, ERC20ABI, provider)

targetTokenAddress = "0x00beA8a7fF710da1cDf01727633B27EF7350D9e2"

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function checkReserves(pairContract) {
    const reserves = await pairContract.getReserves()
    if (reserves[0] > 0n && reserves[1] > 0n) {
        return true
    } else {
        return false
    }
}

async function getReserves(pairContract) {
    const reserves = await pairContract.getReserves()
    console.log(`reserves: ${ethers.formatEther(reserves[0])}, ${ethers.formatUnits(reserves[1], 18)}`)
}

async function approve(signer) {
    console.log("approving...")
    const txApproveWETH = await WETHContract.connect(signer).approve(routerAddress, ethers.MaxUint256);
    await txApproveWETH.wait();
}

async function swap(signer) {
    console.log("swapping...")
    const txSwap = await routerContract.connect(signer).swapExactETHForTokens(
        0,
        [WETH_ADDRESS, targetTokenAddress],
        signer.address,
        Math.floor(Date.now() / 1000) + (60 * 10),
        {
            value: ethers.parseEther('0.1')
        }
    )
    console.log("txSwap:", txSwap)
    const receiptSwap = await txSwap.wait()
    console.log("receiptSwap:", receiptSwap)
}

async function main() {
    // impersonate
    await provider.send("anvil_impersonateAccount", [RECIPIENT])
    const signer = await provider.getSigner(RECIPIENT)

    await approve(signer)

    const PairCreatedFilter1 = factoryContract.filters.PairCreated([targetTokenAddress], [WETH_ADDRESS]);
    console.log("PairCreatedFilter1:", PairCreatedFilter1)
    factoryContract.once(PairCreatedFilter1, async (res) => {
        const pairAddress = res.args[2]
        console.log(`Token <-> WETH pair: ${pairAddress}`)

        const pairContract = new ethers.Contract(pairAddress, pairABI, provider)
        let stop = false
        while (!stop) {
            if (await checkReserves(pairContract)) {
                stop = true
                await swap(signer)
                await getReserves(pairContract)
            }
            sleep(1000)
        }
    })

    const PairCreatedFilter2 = factoryContract.filters.PairCreated([WETH_ADDRESS], [targetTokenAddress]);
    console.log("PairCreatedFilter2:", PairCreatedFilter2)
    factoryContract.once(PairCreatedFilter2, async (res) => {
        const pairAddress = res.args[2]
        console.log(`WETH <-> Token pair: ${pairAddress}`)

        const pairContract = new ethers.Contract(pairAddress, pairABI, provider)
        let stop = false
        while (!stop) {
            if (await checkReserves(pairContract)) {
                stop = true
                await swap(signer)
                await getReserves(pairContract)
            }
            sleep(1000)
        }
    })
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});