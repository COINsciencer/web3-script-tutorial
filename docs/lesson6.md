6.1 项目开盘
+ UniswapV2 建池并添加流动性

6.2 开盘狙击
+ UniswapV2 建池狙击，流动性监测并买进


### Uniswap V2 createPair & addLiquidity

```sh
npm install @uniswap/v2-core
```

anvil testnet (forking & impersonating)

```sh
source .env
anvil --fork-url "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAINNET_KEY}"
```

### Uniswap V2 Sniper

监听建池事件并等待添加流动性，抢先买进

### 参考资料

1. Uniswap V2 createPair 与监听: https://docs.uniswap.org/contracts/v2/reference/smart-contracts/factory
2. Uniswap V2 addLiquidity: https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02