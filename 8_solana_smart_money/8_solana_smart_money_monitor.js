const express = require('express')
const bodyParser = require('body-parser')
const bs58 = require('bs58')

const app = express()
const PORT = 3000

// 解析 JSON 请求体
app.use(bodyParser.json())

// Webhook 接收端点
app.post('/webhook', (req, res) => {
    // console.log('Received Webhook:', JSON.stringify(req.body, null, 2))

    // 解析事件数据
    parseTransferEvent(req.body)

    // 返回 200 响应
    res.status(200).send('Webhook received')
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Webhook server running on http://localhost:${PORT}`)
});

function parseTransferEvent(webhookData) {
    webhookData.forEach((tx) => {
        const { meta, transaction, slot, version } = tx;

        if (meta?.err) {
            console.log(`Transaction in slot ${slot} failed with error:`, meta.err);
            return;
        }

        console.log(`TX: ${webhookData[0].transaction.signatures[0]}`);

        // console.log(`Parsing transaction ${txHash} in slot ${slot}...`);

        const signer = transaction.message.accountKeys[0]
        console.log(`Signer: ${signer}`);

        if (version === 'legacy') {
            const instructions = transaction.message.instructions;
            const accountKeys = transaction.message.accountKeys;

            let isSolTransfer = false

            for (const instruction of instructions) {
                const programId = accountKeys[instruction.programIdIndex];
                if (programId === "11111111111111111111111111111111") {
                    // 解码指令数据
                    const decodedData = bs58.decode(instruction.data);
                    // console.log("Decoded Data:", decodedData);

                    // 检查第 0 字节是否为操作码 2（Transfer 指令）
                    if (decodedData[0] === 2) {
                        isSolTransfer = true;
                    }
                }
            }

            if (isSolTransfer) {
                change = (meta.postBalances[0] - meta.preBalances[0]) / 10 ** 9
                console.log(`  Sent Sol: ${change}`);
            }

        }

        const preSignerMintMap = buildSignerMintMap(meta.preTokenBalances, signer)
        const postSignerMintMap = buildSignerMintMap(meta.postTokenBalances, signer)

        const signerChangesMap = calculateMintAmountChanges(preSignerMintMap, postSignerMintMap)

        signerChangesMap.forEach((change, mint) => {
            if (mint === "So11111111111111111111111111111111111111112") {
                if (change < 0) {
                    console.log(`  Sent Sol: ${change}`);
                } else if (change > 0) {
                    console.log(`  Received Sol: ${change}`);
                }
            } else {
                if (change < 0) {
                    console.log(`  Sent Token: ${mint}: ${change}`);
                } else if (change > 0) {
                    console.log(`  Received Token: ${mint}: ${change}`);
                }
            }
        });
    });
}

function buildSignerMintMap(tokenBalances, signer) {
    const signerMintMap = new Map();

    tokenBalances.forEach(item => {
        const owner = item.owner;
        const mint = item.mint;
        const uiAmount = parseFloat(item.uiTokenAmount.uiAmountString);

        if (owner === signer) {
            if (!signerMintMap.has(mint)) {
                signerMintMap.set(mint, uiAmount);
            } else {
                signerMintMap.set(mint, signerMintMap.get(mint) + uiAmount);
            }
        }
    });

    return signerMintMap;
}

function calculateMintAmountChanges(preMap, postMap) {
    const changesMap = new Map();

    preMap.forEach((preAmount, mint) => {
        const postAmount = postMap.get(mint) || 0;
        const change = postAmount - preAmount;
        changesMap.set(mint, change);
    });

    postMap.forEach((postAmount, mint) => {
        if (!preMap.has(mint)) {
            changesMap.set(mint, postAmount);
        }
    });

    return changesMap;
}