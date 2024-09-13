require('dotenv').config();

const { ethers } = require("ethers");

// Menggunakan variabel dari file .env
const soneiumRPC = process.env.RPC_URL;
const bridgeContractAddress = process.env.BRIDGE_CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const toAddress = process.env.TO_ADDRESS;
const amount = ethers.parseUnits("0.01", 18); // Ganti jumlah token sesuai kebutuhan

const provider = new ethers.JsonRpcProvider(soneiumRPC);
const wallet = new ethers.Wallet(privateKey);
const signer = wallet.connect(provider);

const bridgeABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "bridge",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const bridgeContract = new ethers.Contract(bridgeContractAddress, bridgeABI, signer);

async function bridgeTokens(toAddress, amount) {
    try {
        const tx = await bridgeContract.bridge(toAddress, amount, {
            gasLimit: 500000 // Sesuaikan jika diperlukan
        });
        console.log(`Transaksi dimulai: ${tx.hash}`);

        // Tunggu konfirmasi transaksi
        const receipt = await tx.wait();
        console.log(`Transaksi selesai: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("Terjadi kesalahan saat melakukan bridging:", error);
    }
}

bridgeTokens(toAddress, amount);
