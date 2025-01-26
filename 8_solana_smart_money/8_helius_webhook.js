require('dotenv').config({ path: "../.env" })

accountAddresses = ["5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9","2x5c6W7hzAP3WisDc5no5aPVYjUqMxwDzZ1FTJg9RKDu", "FaoqbZtEnpfSpbSm86VLcwSKiqgWAPfnkPeaEWvFJ5ec", "2datTzoe3WrqL3NgTPiBXzNADyYah92ZQjQzqt5zebti"]

const createWebhook = async () => {
    try {
        const response = await fetch(
            "https://api.helius.xyz/v0/webhooks?api-key=" + process.env.HELIUS_KEY,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "webhookURL": "https://0038-2409-8a15-2a1a-4990-a48d-2ec2-f164-9662.ngrok-free.app/webhook",
                    "transactionTypes": ["TRANSFER"],
                    "accountAddresses": accountAddresses,
                    "webhookType": "raw", // "rawDevnet"
                    "txnStatus": "success", // success/failed
                }),
            }
        );
        const data = await response.json();
        console.log({ data });
    } catch (e) {
        console.error("error", e);
    }
}

createWebhook()