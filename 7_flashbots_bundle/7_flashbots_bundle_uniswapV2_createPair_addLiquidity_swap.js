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
const signer = new ethers.Wallet(privateKey, provider)

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

const PIGABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const bytecode = '608060405234801561000f575f80fd5b50336040518060400160405280600781526020017f506967436f696e000000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f5049470000000000000000000000000000000000000000000000000000000000815250816003908161008c9190610421565b50806004908161009c9190610421565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361010f575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610106919061052f565b60405180910390fd5b61011e8161012460201b60201c565b50610548565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061026257607f821691505b6020821081036102755761027461021e565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026102d77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261029c565b6102e1868361029c565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61032561032061031b846102f9565b610302565b6102f9565b9050919050565b5f819050919050565b61033e8361030b565b61035261034a8261032c565b8484546102a8565b825550505050565b5f90565b61036661035a565b610371818484610335565b505050565b5b81811015610394576103895f8261035e565b600181019050610377565b5050565b601f8211156103d9576103aa8161027b565b6103b38461028d565b810160208510156103c2578190505b6103d66103ce8561028d565b830182610376565b50505b505050565b5f82821c905092915050565b5f6103f95f19846008026103de565b1980831691505092915050565b5f61041183836103ea565b9150826002028217905092915050565b61042a826101e7565b67ffffffffffffffff811115610443576104426101f1565b5b61044d825461024b565b610458828285610398565b5f60209050601f831160018114610489575f8415610477578287015190505b6104818582610406565b8655506104e8565b601f1984166104978661027b565b5f5b828110156104be57848901518255600182019150602085019450602081019050610499565b868310156104db57848901516104d7601f8916826103ea565b8355505b6001600288020188555050505b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610519826104f0565b9050919050565b6105298161050f565b82525050565b5f6020820190506105425f830184610520565b92915050565b61111b806105555f395ff3fe608060405234801561000f575f80fd5b50600436106100cd575f3560e01c806370a082311161008a57806395d89b411161006457806395d89b41146101ff578063a9059cbb1461021d578063dd62ed3e1461024d578063f2fde38b1461027d576100cd565b806370a08231146101a7578063715018a6146101d75780638da5cb5b146101e1576100cd565b806306fdde03146100d1578063095ea7b3146100ef57806318160ddd1461011f57806323b872dd1461013d578063313ce5671461016d57806340c10f191461018b575b5f80fd5b6100d9610299565b6040516100e69190610d94565b60405180910390f35b61010960048036038101906101049190610e45565b610329565b6040516101169190610e9d565b60405180910390f35b61012761034b565b6040516101349190610ec5565b60405180910390f35b61015760048036038101906101529190610ede565b610354565b6040516101649190610e9d565b60405180910390f35b610175610382565b6040516101829190610f49565b60405180910390f35b6101a560048036038101906101a09190610e45565b61038a565b005b6101c160048036038101906101bc9190610f62565b6103a0565b6040516101ce9190610ec5565b60405180910390f35b6101df6103e5565b005b6101e96103f8565b6040516101f69190610f9c565b60405180910390f35b610207610420565b6040516102149190610d94565b60405180910390f35b61023760048036038101906102329190610e45565b6104b0565b6040516102449190610e9d565b60405180910390f35b61026760048036038101906102629190610fb5565b6104d2565b6040516102749190610ec5565b60405180910390f35b61029760048036038101906102929190610f62565b610554565b005b6060600380546102a890611020565b80601f01602080910402602001604051908101604052809291908181526020018280546102d490611020565b801561031f5780601f106102f65761010080835404028352916020019161031f565b820191905f5260205f20905b81548152906001019060200180831161030257829003601f168201915b5050505050905090565b5f806103336105d8565b90506103408185856105df565b600191505092915050565b5f600254905090565b5f8061035e6105d8565b905061036b8582856105f1565b610376858585610683565b60019150509392505050565b5f6012905090565b610392610773565b61039c82826107fa565b5050565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6103ed610773565b6103f65f610879565b565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606004805461042f90611020565b80601f016020809104026020016040519081016040528092919081815260200182805461045b90611020565b80156104a65780601f1061047d576101008083540402835291602001916104a6565b820191905f5260205f20905b81548152906001019060200180831161048957829003601f168201915b5050505050905090565b5f806104ba6105d8565b90506104c7818585610683565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b61055c610773565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036105cc575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016105c39190610f9c565b60405180910390fd5b6105d581610879565b50565b5f33905090565b6105ec838383600161093c565b505050565b5f6105fc84846104d2565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461067d578181101561066e578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161066593929190611050565b60405180910390fd5b61067c84848484035f61093c565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036106f3575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016106ea9190610f9c565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610763575f6040517fec442f0500000000000000000000000000000000000000000000000000000000815260040161075a9190610f9c565b60405180910390fd5b61076e838383610b0b565b505050565b61077b6105d8565b73ffffffffffffffffffffffffffffffffffffffff166107996103f8565b73ffffffffffffffffffffffffffffffffffffffff16146107f8576107bc6105d8565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016107ef9190610f9c565b60405180910390fd5b565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361086a575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108619190610f9c565b60405180910390fd5b6108755f8383610b0b565b5050565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036109ac575f6040517fe602df050000000000000000000000000000000000000000000000000000000081526004016109a39190610f9c565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610a1c575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610a139190610f9c565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610b05578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610afc9190610ec5565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b5b578060025f828254610b4f91906110b2565b92505081905550610c29565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610be4578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610bdb93929190611050565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610c70578060025f8282540392505081905550610cba565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610d179190610ec5565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f610d6682610d24565b610d708185610d2e565b9350610d80818560208601610d3e565b610d8981610d4c565b840191505092915050565b5f6020820190508181035f830152610dac8184610d5c565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610de182610db8565b9050919050565b610df181610dd7565b8114610dfb575f80fd5b50565b5f81359050610e0c81610de8565b92915050565b5f819050919050565b610e2481610e12565b8114610e2e575f80fd5b50565b5f81359050610e3f81610e1b565b92915050565b5f8060408385031215610e5b57610e5a610db4565b5b5f610e6885828601610dfe565b9250506020610e7985828601610e31565b9150509250929050565b5f8115159050919050565b610e9781610e83565b82525050565b5f602082019050610eb05f830184610e8e565b92915050565b610ebf81610e12565b82525050565b5f602082019050610ed85f830184610eb6565b92915050565b5f805f60608486031215610ef557610ef4610db4565b5b5f610f0286828701610dfe565b9350506020610f1386828701610dfe565b9250506040610f2486828701610e31565b9150509250925092565b5f60ff82169050919050565b610f4381610f2e565b82525050565b5f602082019050610f5c5f830184610f3a565b92915050565b5f60208284031215610f7757610f76610db4565b5b5f610f8484828501610dfe565b91505092915050565b610f9681610dd7565b82525050565b5f602082019050610faf5f830184610f8d565b92915050565b5f8060408385031215610fcb57610fca610db4565b5b5f610fd885828601610dfe565b9250506020610fe985828601610dfe565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061103757607f821691505b60208210810361104a57611049610ff3565b5b50919050565b5f6060820190506110635f830186610f8d565b6110706020830185610eb6565b61107d6040830184610eb6565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6110bc82610e12565b91506110c783610e12565b92508282019050808211156110df576110de611085565b5b9291505056fea26469706673582212201f9cfe05b4a25e6b33673c7d5217ef769780aaa4a6aa32c2dde07ea6c8bca8e964736f6c63430008190033'

const WETH_ADDRESS = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'
const WETHContract = new ethers.Contract(WETH_ADDRESS, ERC20ABI, provider)

const factoryAddress = '0xc9f18c25Cfca2975d6eD18Fc63962EBd1083e978'
const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider)
const routerAddress = '0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98' // failed contract
const routerContract = new ethers.Contract(routerAddress, routerABI, provider)

async function deploy(abi, bytecode, signer) {
    const factory = new ethers.ContractFactory(abi, bytecode, signer);

    // deploy contract with constructor params
    const contract = await factory.deploy()
    console.log(`contract adderss: ${contract.target}`); // or await contract.getAddress()
    const tx = contract.deploymentTransaction()
    console.log("tx:", tx)
    const receipt = await tx.wait() // or contract.waitForDeployment()
    console.log("receipt:", receipt)

    return contract
}

async function getReserves(pairContract) {
    const reserves = await pairContract.getReserves()
    console.log(`reserves: ${ethers.formatEther(reserves[0])}, ${ethers.formatUnits(reserves[1], 18)}`)
}

async function main() {
    // const PIGContract = await deploy(PIGABI, bytecode, signer) // 0xb93C731200B17cE2ee4B193d8aaedC6Ce8C77028

    // // mint PIG
    // const mintAmount = ethers.parseUnits('1000000', 18)
    // const txMint = await PIGContract.connect(signer).mint(signer.address, mintAmount)
    // // console.log("txMint:", txMint)
    // const recepitMint = txMint.wait()
    // // console.log("recepitMint:", recepitMint)
    // const PIGBalance = await PIGContract.balanceOf(signer.address)
    // console.log(`signer PIG balance: ${ethers.formatUnits(PIGBalance, 18)}`)

    // // create pair
    // const txCreatePair = await factoryContract.connect(signer).createPair(PIGContract.target, WETH_ADDRESS);
    // console.log("txCreatePair:", txCreatePair)
    // const receiptCreatePair = await txCreatePair.wait()
    // console.log("receiptCreatePair:", receiptCreatePair)
    // const pairAddress = await factoryContract.getPair(PIGContract.target, WETH_ADDRESS)
    // console.log("pair address:", pairAddress) // 0x9BE77f426DAF55379734Be0e8B34CeDA7a3AC7de
    // const pairContract = new ethers.Contract(pairAddress, pairABI, provider)

    // // approve
    // const txApprovePIG = await PIGContract.connect(signer).approve(routerAddress, ethers.MaxUint256);
    // await txApprovePIG.wait();
    // const txApproveWETH = await WETHContract.connect(signer).approve(routerAddress, ethers.MaxUint256);
    // await txApproveWETH.wait();

    // // wrap ETH to WETH
    // const txWrap = await signer.sendTransaction({
    // 	to: WETH_ADDRESS,
    // 	value: ethers.parseEther('0.001')
    // })
    // const receiptWrap = await txWrap.wait()
    // const WETHBalance = await WETHContract.balanceOf(signer.address)
    // console.log(`signer WETH balance: ${ethers.formatEther(WETHBalance)}`)

    const PIGContract = new ethers.Contract("0xb93C731200B17cE2ee4B193d8aaedC6Ce8C77028", PIGABI, provider)
    const pairContract = new ethers.Contract("0x9BE77f426DAF55379734Be0e8B34CeDA7a3AC7de", pairABI, provider)

    // get reserves
    await getReserves(pairContract)

    // for flashbots reputation
    const authSigner = ethers.Wallet.createRandom();

    // flashbots sepolia rpc
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        // comment the 2 lines below if using mainnet
        'https://relay-sepolia.flashbots.net/',
        'sepolia'
    )

    // prepare txs
    const txAddLiquidity = {
        signer: signer,
        transaction: await routerContract.addLiquidity.populateTransaction(
            PIGContract.target,
            WETH_ADDRESS,
            ethers.parseUnits('1000000', 18),
            ethers.parseEther('0.001'),
            0,
            0,
            signer.address,
            Math.floor(Date.now() / 1000 + (60 * 60)), // 1 hour from now
            {
                chainId: CHAIN_ID,
                type: 2,
                gasLimit: "300000",
                maxFeePerGas: ethers.parseUnits("3", "gwei"),
                maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
            }
        )
    }
    const txSwap = {
        signer: signer,
        transaction: await routerContract.swapExactETHForTokens.populateTransaction(
            0,
            [WETH_ADDRESS, PIGContract.target],
            signer.address,
            Math.floor(Date.now() / 1000) + (60 * 60),
            {
                chainId: CHAIN_ID,
                type: 2,
                value: ethers.parseEther('0.002'),
                gasLimit: "200000",
                maxFeePerGas: ethers.parseUnits("20", "gwei"),
                maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
            }
        )
    }

    // create bundle
    const transactionBundle = [
        txAddLiquidity,
        txSwap,
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
            // get reserves
            await getReserves(pairContract)
            process.exit(0);
        } else if (bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
            console.log(`not included in block #${targetBlockNumber}`);
        } else if (bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
            console.log("nonce too high");
            process.exit(1);
        }
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});