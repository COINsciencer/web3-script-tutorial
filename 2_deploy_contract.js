const { ethers } = require("ethers");
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`)
// Sepolia
// const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)
const provider = new ethers.AlchemyProvider("sepolia", process.env.ALCHEMY_SEPOLIA_KEY);

const privateKey = process.env.PRIVATE_KEY_0

const signer = new ethers.Wallet(privateKey, provider)

const ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "_arr",
				"type": "uint256[]"
			}
		],
		"name": "getSum",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "sum",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable[]",
				"name": "_addresses",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_amounts",
				"type": "uint256[]"
			}
		],
		"name": "multiTransferETH",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "address[]",
				"name": "_addresses",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_amounts",
				"type": "uint256[]"
			}
		],
		"name": "multiTransferToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "withdrawFromFailList",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const bytecode = "0x6080604052348015600f57600080fd5b50610ede8061001f6000396000f3fe60806040526004361061003f5760003560e01c806341ed24a21461004457806377988cf81461006d578063acacd8ee14610089578063ccb8c1e0146100b2575b600080fd5b34801561005057600080fd5b5061006b600480360381019061006691906107cb565b6100ef565b005b610087600480360381019061008291906108b6565b6102ee565b005b34801561009557600080fd5b506100b060048036038101906100ab9190610937565b6104df565b005b3480156100be57600080fd5b506100d960048036038101906100d49190610964565b61065a565b6040516100e691906109ca565b60405180910390f35b818190508484905014610137576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161012e90610a68565b60405180910390fd5b60008590506000610148848461065a565b9050808273ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b8152600401610186929190610a97565b602060405180830381865afa1580156101a3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101c79190610aec565b1015610208576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ff90610b65565b60405180910390fd5b60005b868690508110156102e4578273ffffffffffffffffffffffffffffffffffffffff166323b872dd3389898581811061024657610245610b85565b5b905060200201602081019061025b9190610937565b88888681811061026e5761026d610b85565b5b905060200201356040518463ffffffff1660e01b815260040161029393929190610bb4565b6020604051808303816000875af11580156102b2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102d69190610c23565b50808060010191505061020b565b5050505050505050565b818190508484905014610336576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161032d90610a68565b60405180910390fd5b6000610342838361065a565b9050803414610386576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161037d90610c9c565b60405180910390fd5b60005b858590508110156104d75760008686838181106103a9576103a8610b85565b5b90506020020160208101906103be9190610cfa565b73ffffffffffffffffffffffffffffffffffffffff168585848181106103e7576103e6610b85565b5b905060200201356040516103fa90610d58565b60006040518083038185875af1925050503d8060008114610437576040519150601f19603f3d011682016040523d82523d6000602084013e61043c565b606091505b50509050806104c95784848381811061045857610457610b85565b5b9050602002013560008089898681811061047557610474610b85565b5b905060200201602081019061048a9190610cfa565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b508080600101915050610389565b505050505050565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008111610565576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161055c90610db9565b60405180910390fd5b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060008273ffffffffffffffffffffffffffffffffffffffff16826040516105cf90610d58565b60006040518083038185875af1925050503d806000811461060c576040519150601f19603f3d011682016040523d82523d6000602084013e610611565b606091505b5050905080610655576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064c90610e25565b60405180910390fd5b505050565b600080600090505b838390508110156106a1578383828181106106805761067f610b85565b5b90506020020135826106929190610e74565b91508080600101915050610662565b5092915050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006106dd826106b2565b9050919050565b6106ed816106d2565b81146106f857600080fd5b50565b60008135905061070a816106e4565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261073557610734610710565b5b8235905067ffffffffffffffff81111561075257610751610715565b5b60208301915083602082028301111561076e5761076d61071a565b5b9250929050565b60008083601f84011261078b5761078a610710565b5b8235905067ffffffffffffffff8111156107a8576107a7610715565b5b6020830191508360208202830111156107c4576107c361071a565b5b9250929050565b6000806000806000606086880312156107e7576107e66106a8565b5b60006107f5888289016106fb565b955050602086013567ffffffffffffffff811115610816576108156106ad565b5b6108228882890161071f565b9450945050604086013567ffffffffffffffff811115610845576108446106ad565b5b61085188828901610775565b92509250509295509295909350565b60008083601f84011261087657610875610710565b5b8235905067ffffffffffffffff81111561089357610892610715565b5b6020830191508360208202830111156108af576108ae61071a565b5b9250929050565b600080600080604085870312156108d0576108cf6106a8565b5b600085013567ffffffffffffffff8111156108ee576108ed6106ad565b5b6108fa87828801610860565b9450945050602085013567ffffffffffffffff81111561091d5761091c6106ad565b5b61092987828801610775565b925092505092959194509250565b60006020828403121561094d5761094c6106a8565b5b600061095b848285016106fb565b91505092915050565b6000806020838503121561097b5761097a6106a8565b5b600083013567ffffffffffffffff811115610999576109986106ad565b5b6109a585828601610775565b92509250509250929050565b6000819050919050565b6109c4816109b1565b82525050565b60006020820190506109df60008301846109bb565b92915050565b600082825260208201905092915050565b7f4c656e67746873206f662041646472657373657320616e6420416d6f756e747360008201527f204e4f5420455155414c00000000000000000000000000000000000000000000602082015250565b6000610a52602a836109e5565b9150610a5d826109f6565b604082019050919050565b60006020820190508181036000830152610a8181610a45565b9050919050565b610a91816106d2565b82525050565b6000604082019050610aac6000830185610a88565b610ab96020830184610a88565b9392505050565b610ac9816109b1565b8114610ad457600080fd5b50565b600081519050610ae681610ac0565b92915050565b600060208284031215610b0257610b016106a8565b5b6000610b1084828501610ad7565b91505092915050565b7f4e65656420417070726f766520455243323020746f6b656e0000000000000000600082015250565b6000610b4f6018836109e5565b9150610b5a82610b19565b602082019050919050565b60006020820190508181036000830152610b7e81610b42565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000606082019050610bc96000830186610a88565b610bd66020830185610a88565b610be360408301846109bb565b949350505050565b60008115159050919050565b610c0081610beb565b8114610c0b57600080fd5b50565b600081519050610c1d81610bf7565b92915050565b600060208284031215610c3957610c386106a8565b5b6000610c4784828501610c0e565b91505092915050565b7f5472616e7366657220616d6f756e74206572726f720000000000000000000000600082015250565b6000610c866015836109e5565b9150610c9182610c50565b602082019050919050565b60006020820190508181036000830152610cb581610c79565b9050919050565b6000610cc7826106b2565b9050919050565b610cd781610cbc565b8114610ce257600080fd5b50565b600081359050610cf481610cce565b92915050565b600060208284031215610d1057610d0f6106a8565b5b6000610d1e84828501610ce5565b91505092915050565b600081905092915050565b50565b6000610d42600083610d27565b9150610d4d82610d32565b600082019050919050565b6000610d6382610d35565b9150819050919050565b7f596f7520617265206e6f7420696e206661696c6564206c697374000000000000600082015250565b6000610da3601a836109e5565b9150610dae82610d6d565b602082019050919050565b60006020820190508181036000830152610dd281610d96565b9050919050565b7f4661696c20776974686472617700000000000000000000000000000000000000600082015250565b6000610e0f600d836109e5565b9150610e1a82610dd9565b602082019050919050565b60006020820190508181036000830152610e3e81610e02565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610e7f826109b1565b9150610e8a836109b1565b9250828201905080821115610ea257610ea1610e45565b5b9291505056fea2646970667358221220bbca317e9749e179c9b014e10db6511558871fff4d39877034da36379586bf1864736f6c634300081c0033"

async function deploy(ABI, bytecode, signer) {
	const factory = new ethers.ContractFactory(ABI, bytecode, signer);

	// deploy contract with constructor params
	const contract = await factory.deploy()
	console.log(`contract adderss: ${contract.target}`); // or await contract.getAddress()
	const tx = contract.deploymentTransaction()
	console.log("tx:", tx)
	const receipt = await tx.wait() // or contract.waitForDeployment() 
    console.log("receipt:", receipt)
}

async function main() {
	await deploy(ABI, bytecode, signer) // 0x4e52bEc294BD4CF3c826aB98671782E373F7779b
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});