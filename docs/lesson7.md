7.1 MEV 与 Flashbots Bundle

7.2 私钥泄露后挽救资产
+ 打包转 gas 和 ERC20 转账交易

7.3 开盘防狙击
+ 打包建池、添加流动性、拉盘交易


### MEV & Flashbots Bundle

将多笔交易发到暗池，贿赂出块者，将多笔交易放在同一个区块中连续的交易序列

Install ethers-provider-flashbots-bundle

```sh
npm install @flashbots/ethers-provider-bundle
```

#### 私钥泄露后挽救资产

1）为泄露私钥的地址转账一点 gas
2）用泄露私钥的地址将其他资产转出

encodeFunctionData

https://sepolia.etherscan.io/txs?block=7560265&p=2
https://sepolia.etherscan.io/tx/0x6391337cfd19bb394fcab74ed339eb87193d58a99c3366207b109c9509e46c2b
https://sepolia.etherscan.io/tx/0x4f522af6a4c7421d4b171e62774f04b59c07d4cf5fb8539d6e44debc8705200a

#### 开盘防狙击

0）deploy，mint，createPair，approve

1）addLiquidity
2）swap

populateTransaction

https://sepolia.etherscan.io/txs?block=5710581&p=2
https://sepolia.etherscan.io/tx/0x0b4b5ff8d84b9bc19c22a1b047269ea0f183319803b5942d3cd7b43c86c6fdbb
https://sepolia.etherscan.io/tx/0x8f82d67084f788f3c2ae4e7a8326c162a88a2c1b26c63e8d77f73c334414de6c

### 参考资料
1. MEV: https://ethereum.org/en/developers/docs/mev/
2. flashbots bundle: https://docs.flashbots.net/flashbots-auction/advanced/understanding-bundles
3. ethers-provider-flashbots-bundle: https://github.com/flashbots/ethers-provider-flashbots-bundle