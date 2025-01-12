const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" //localnet account #0

const signer = new ethers.Wallet(privateKey, provider)

const ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOperator",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721NonexistentToken",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const bytecode = "0x608060405234801561001057600080fd5b506040518060400160405280600d81526020017f46726565204d696e74204e4654000000000000000000000000000000000000008152506040518060400160405280600881526020017f467265654d696e74000000000000000000000000000000000000000000000000815250816000908161008c91906102f4565b50806001908161009c91906102f4565b5050506103c6565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061012557607f821691505b602082108103610138576101376100de565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026101a07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610163565b6101aa8683610163565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006101f16101ec6101e7846101c2565b6101cc565b6101c2565b9050919050565b6000819050919050565b61020b836101d6565b61021f610217826101f8565b848454610170565b825550505050565b600090565b610234610227565b61023f818484610202565b505050565b5b818110156102635761025860008261022c565b600181019050610245565b5050565b601f8211156102a8576102798161013e565b61028284610153565b81016020851015610291578190505b6102a561029d85610153565b830182610244565b50505b505050565b600082821c905092915050565b60006102cb600019846008026102ad565b1980831691505092915050565b60006102e483836102ba565b9150826002028217905092915050565b6102fd826100a4565b67ffffffffffffffff811115610316576103156100af565b5b610320825461010d565b61032b828285610267565b600060209050601f83116001811461035e576000841561034c578287015190505b61035685826102d8565b8655506103be565b601f19841661036c8661013e565b60005b828110156103945784890151825560018201915060208501945060208101905061036f565b868310156103b157848901516103ad601f8916826102ba565b8355505b6001600288020188555050505b505050505050565b611e68806103d56000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806342842e0e11610097578063a22cb46511610066578063a22cb46514610272578063b88d4fde1461028e578063c87b56dd146102aa578063e985e9c5146102da576100f5565b806342842e0e146101d85780636352211e146101f457806370a082311461022457806395d89b4114610254576100f5565b8063095ea7b3116100d3578063095ea7b3146101785780631249c58b1461019457806318160ddd1461019e57806323b872dd146101bc576100f5565b806301ffc9a7146100fa57806306fdde031461012a578063081812fc14610148575b600080fd5b610114600480360381019061010f919061163b565b61030a565b6040516101219190611683565b60405180910390f35b6101326103ec565b60405161013f919061172e565b60405180910390f35b610162600480360381019061015d9190611786565b61047e565b60405161016f91906117f4565b60405180910390f35b610192600480360381019061018d919061183b565b61049a565b005b61019c6104b0565b005b6101a66104d6565b6040516101b3919061188a565b60405180910390f35b6101d660048036038101906101d191906118a5565b6104dc565b005b6101f260048036038101906101ed91906118a5565b6105de565b005b61020e60048036038101906102099190611786565b6105fe565b60405161021b91906117f4565b60405180910390f35b61023e600480360381019061023991906118f8565b610610565b60405161024b919061188a565b60405180910390f35b61025c6106ca565b604051610269919061172e565b60405180910390f35b61028c60048036038101906102879190611951565b61075c565b005b6102a860048036038101906102a39190611ac6565b610772565b005b6102c460048036038101906102bf9190611786565b610797565b6040516102d1919061172e565b60405180910390f35b6102f460048036038101906102ef9190611b49565b610800565b6040516103019190611683565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806103d557507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103e557506103e482610894565b5b9050919050565b6060600080546103fb90611bb8565b80601f016020809104026020016040519081016040528092919081815260200182805461042790611bb8565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b6000610489826108fe565b5061049382610986565b9050919050565b6104ac82826104a76109c3565b6109cb565b5050565b6104bc336006546109dd565b600660008154809291906104cf90611c18565b9190505550565b60065481565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361054e5760006040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161054591906117f4565b60405180910390fd5b6000610562838361055d6109c3565b610ad6565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146105d8578382826040517f64283d7b0000000000000000000000000000000000000000000000000000000081526004016105cf93929190611c60565b60405180910390fd5b50505050565b6105f983838360405180602001604052806000815250610772565b505050565b6000610609826108fe565b9050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036106835760006040517f89c62b6400000000000000000000000000000000000000000000000000000000815260040161067a91906117f4565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600180546106d990611bb8565b80601f016020809104026020016040519081016040528092919081815260200182805461070590611bb8565b80156107525780601f1061072757610100808354040283529160200191610752565b820191906000526020600020905b81548152906001019060200180831161073557829003601f168201915b5050505050905090565b61076e6107676109c3565b8383610cf0565b5050565b61077d8484846104dc565b6107916107886109c3565b85858585610e5f565b50505050565b60606107a2826108fe565b5060006107ad611010565b905060008151116107cd57604051806020016040528060008152506107f8565b806107d784611027565b6040516020016107e8929190611cd3565b6040516020818303038152906040525b915050919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008061090a836110f5565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361097d57826040517f7e273289000000000000000000000000000000000000000000000000000000008152600401610974919061188a565b60405180910390fd5b80915050919050565b60006004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600033905090565b6109d88383836001611132565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610a4f5760006040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610a4691906117f4565b60405180910390fd5b6000610a5d83836000610ad6565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610ad15760006040517f73c6ac6e000000000000000000000000000000000000000000000000000000008152600401610ac891906117f4565b60405180910390fd5b505050565b600080610ae2846110f5565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610b2457610b238184866112f7565b5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610bb557610b66600085600080611132565b6001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610c38576001600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b846002600086815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d6157816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401610d5891906117f4565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610e529190611683565b60405180910390a3505050565b60008373ffffffffffffffffffffffffffffffffffffffff163b1115611009578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02868685856040518563ffffffff1660e01b8152600401610ebe9493929190611d4c565b6020604051808303816000875af1925050508015610efa57506040513d601f19601f82011682018060405250810190610ef79190611dad565b60015b610f7e573d8060008114610f2a576040519150601f19603f3d011682016040523d82523d6000602084013e610f2f565b606091505b506000815103610f7657836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610f6d91906117f4565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461100757836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610ffe91906117f4565b60405180910390fd5b505b5050505050565b606060405180602001604052806000815250905090565b606060006001611036846113bb565b01905060008167ffffffffffffffff8111156110555761105461199b565b5b6040519080825280601f01601f1916602001820160405280156110875781602001600182028036833780820191505090505b509050600082602001820190505b6001156110ea578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a85816110de576110dd611dda565b5b04945060008503611095575b819350505050919050565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b808061116b5750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b1561129f57600061117b846108fe565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141580156111e657508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b80156111f957506111f78184610800565b155b1561123b57826040517fa9fbf51f00000000000000000000000000000000000000000000000000000000815260040161123291906117f4565b60405180910390fd5b811561129d57838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b836004600085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b61130283838361150e565b6113b657600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361137757806040517f7e27328900000000000000000000000000000000000000000000000000000000815260040161136e919061188a565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016113ad929190611e09565b60405180910390fd5b505050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611419577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161140f5761140e611dda565b5b0492506040810190505b6d04ee2d6d415b85acef81000000008310611456576d04ee2d6d415b85acef8100000000838161144c5761144b611dda565b5b0492506020810190505b662386f26fc10000831061148557662386f26fc10000838161147b5761147a611dda565b5b0492506010810190505b6305f5e10083106114ae576305f5e10083816114a4576114a3611dda565b5b0492506008810190505b61271083106114d35761271083816114c9576114c8611dda565b5b0492506004810190505b606483106114f657606483816114ec576114eb611dda565b5b0492506002810190505b600a8310611505576001810190505b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141580156115c657508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148061158757506115868484610800565b5b806115c557508273ffffffffffffffffffffffffffffffffffffffff166115ad83610986565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611618816115e3565b811461162357600080fd5b50565b6000813590506116358161160f565b92915050565b600060208284031215611651576116506115d9565b5b600061165f84828501611626565b91505092915050565b60008115159050919050565b61167d81611668565b82525050565b60006020820190506116986000830184611674565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156116d85780820151818401526020810190506116bd565b60008484015250505050565b6000601f19601f8301169050919050565b60006117008261169e565b61170a81856116a9565b935061171a8185602086016116ba565b611723816116e4565b840191505092915050565b6000602082019050818103600083015261174881846116f5565b905092915050565b6000819050919050565b61176381611750565b811461176e57600080fd5b50565b6000813590506117808161175a565b92915050565b60006020828403121561179c5761179b6115d9565b5b60006117aa84828501611771565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006117de826117b3565b9050919050565b6117ee816117d3565b82525050565b600060208201905061180960008301846117e5565b92915050565b611818816117d3565b811461182357600080fd5b50565b6000813590506118358161180f565b92915050565b60008060408385031215611852576118516115d9565b5b600061186085828601611826565b925050602061187185828601611771565b9150509250929050565b61188481611750565b82525050565b600060208201905061189f600083018461187b565b92915050565b6000806000606084860312156118be576118bd6115d9565b5b60006118cc86828701611826565b93505060206118dd86828701611826565b92505060406118ee86828701611771565b9150509250925092565b60006020828403121561190e5761190d6115d9565b5b600061191c84828501611826565b91505092915050565b61192e81611668565b811461193957600080fd5b50565b60008135905061194b81611925565b92915050565b60008060408385031215611968576119676115d9565b5b600061197685828601611826565b92505060206119878582860161193c565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6119d3826116e4565b810181811067ffffffffffffffff821117156119f2576119f161199b565b5b80604052505050565b6000611a056115cf565b9050611a1182826119ca565b919050565b600067ffffffffffffffff821115611a3157611a3061199b565b5b611a3a826116e4565b9050602081019050919050565b82818337600083830152505050565b6000611a69611a6484611a16565b6119fb565b905082815260208101848484011115611a8557611a84611996565b5b611a90848285611a47565b509392505050565b600082601f830112611aad57611aac611991565b5b8135611abd848260208601611a56565b91505092915050565b60008060008060808587031215611ae057611adf6115d9565b5b6000611aee87828801611826565b9450506020611aff87828801611826565b9350506040611b1087828801611771565b925050606085013567ffffffffffffffff811115611b3157611b306115de565b5b611b3d87828801611a98565b91505092959194509250565b60008060408385031215611b6057611b5f6115d9565b5b6000611b6e85828601611826565b9250506020611b7f85828601611826565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611bd057607f821691505b602082108103611be357611be2611b89565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611c2382611750565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611c5557611c54611be9565b5b600182019050919050565b6000606082019050611c7560008301866117e5565b611c82602083018561187b565b611c8f60408301846117e5565b949350505050565b600081905092915050565b6000611cad8261169e565b611cb78185611c97565b9350611cc78185602086016116ba565b80840191505092915050565b6000611cdf8285611ca2565b9150611ceb8284611ca2565b91508190509392505050565b600081519050919050565b600082825260208201905092915050565b6000611d1e82611cf7565b611d288185611d02565b9350611d388185602086016116ba565b611d41816116e4565b840191505092915050565b6000608082019050611d6160008301876117e5565b611d6e60208301866117e5565b611d7b604083018561187b565b8181036060830152611d8d8184611d13565b905095945050505050565b600081519050611da78161160f565b92915050565b600060208284031215611dc357611dc26115d9565b5b6000611dd184828501611d98565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000604082019050611e1e60008301856117e5565b611e2b602083018461187b565b939250505056fea2646970667358221220da99c87912291deaee550524f1cf44ff2d2671f5ecaf1a4e34c31d7bf56194ed64736f6c634300081c0033"

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
    await deploy(ABI, bytecode, signer) // 0x5FbDB2315678afecb367f032d93F642f64180aa3
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});