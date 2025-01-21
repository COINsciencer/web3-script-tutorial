const { ethers } = require("ethers")
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const RECIPIENT = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth

const { abi: factoryABI } = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const { abi: pairABI } = require('@uniswap/v2-periphery/build/IUniswapV2Pair.json')
const { abi: routerABI } = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')

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

const PIGABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const WETHContract = new ethers.Contract(WETH_ADDRESS, ERC20ABI, provider)

const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider)
const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const routerContract =  new ethers.Contract(routerAddress, routerABI, provider)

async function getReserves(pairContract) {
	const reserves = await pairContract.getReserves()
    console.log(`reserves: ${ethers.formatEther(reserves[0])}, ${ethers.formatUnits(reserves[1], 18)}`)
}

async function main() {
	// impersonate
    await provider.send("anvil_impersonateAccount", [RECIPIENT])
    const signer = await provider.getSigner(RECIPIENT)

	const PIGContract = new ethers.Contract("0x00beA8a7fF710da1cDf01727633B27EF7350D9e2", PIGABI, provider)
	const PIGBalance = await PIGContract.balanceOf(signer.address)
	console.log(`recipient PIG balance: ${ethers.formatUnits(PIGBalance, 18)}`)

	// create pair
	const txCreatePair = await factoryContract.connect(signer).createPair(PIGContract.target, WETH_ADDRESS);
	console.log("txCreatePair:", txCreatePair)
    const receiptCreatePair = await txCreatePair.wait()
    console.log("receiptCreatePair:", receiptCreatePair)
    const pairAddress = await factoryContract.getPair(PIGContract.target, WETH_ADDRESS)
    console.log("pair address:", pairAddress)

    // approve
    const txApprovePIG = await PIGContract.connect(signer).approve(routerAddress, ethers.MaxUint256);
    await txApprovePIG.wait();
    const txApproveWETH = await WETHContract.connect(signer).approve(routerAddress, ethers.MaxUint256);
    await txApproveWETH.wait();

    // add liquidity
    const txAddLiquidity = await routerContract.connect(signer).addLiquidity(
        PIGContract.target,
        WETH_ADDRESS,
        ethers.parseUnits('1000000', 18),
        ethers.parseEther('1'),
        0,
        0,
        signer.address,
        Math.floor(Date.now() / 1000 + (60 * 10))
    )
    console.log("txAddLiquidity:", txAddLiquidity)
    const receiptAddLiquidity = await txAddLiquidity.wait()
    console.log("receiptAddLiquidity:", receiptAddLiquidity)

    // get reserves
    const pairContract = new ethers.Contract(pairAddress, pairABI, provider)
    await getReserves(pairContract)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});