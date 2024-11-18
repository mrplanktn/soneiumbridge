require('dotenv').config();
const Web3 = require("web3");

// Ambil variabel dari .env
const SEPOLIA_RPC = process.env.SEPOLIA_RPC;
const SONEIUM_RPC = process.env.SONEIUM_RPC;

const SEPOLIA_BRIDGE_ADDRESS = process.env.SEPOLIA_BRIDGE_ADDRESS;
const SONEIUM_BRIDGE_ADDRESS = process.env.SONEIUM_BRIDGE_ADDRESS;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS;
const AMOUNT = process.env.AMOUNT;

// Fungsi utama
async function bridgeToken() {
    try {
        const sepoliaWeb3 = new Web3(new Web3.providers.HttpProvider(SEPOLIA_RPC));

        const account = sepoliaWeb3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
        sepoliaWeb3.eth.accounts.wallet.add(account);
        sepoliaWeb3.eth.defaultAccount = account.address;

        const sepoliaBridgeContract = new sepoliaWeb3.eth.Contract(BRIDGE_ABI, SEPOLIA_BRIDGE_ADDRESS);

        console.log("Locking tokens on Sepolia...");
        const tx = sepoliaBridgeContract.methods.lockTokens(AMOUNT, RECEIVER_ADDRESS);

        const gas = await tx.estimateGas({ from: account.address });
        const gasPrice = await sepoliaWeb3.eth.getGasPrice();
        const data = tx.encodeABI();

        const txData = {
            from: account.address,
            to: SEPOLIA_BRIDGE_ADDRESS,
            data,
            gas,
            gasPrice
        };

        const receipt = await sepoliaWeb3.eth.sendTransaction(txData);
        console.log("Transaction hash:", receipt.transactionHash);
    } catch (error) {
        console.error("Error during bridge operation:", error);
    }
}

// Eksekusi script
bridgeToken();
