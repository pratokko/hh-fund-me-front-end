import { ethers } from "./ethers-5.6.esm.min.js"
import { contractAddress, abi } from "./constants.js"

const connectButton = document.getElementById("connect")
const fundButton = document.getElementById("fund")
const balanceButton = document.getElementById("balanceButton")
const withdrawBtn = document.getElementById("withdrawBtn")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawBtn.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== undefined) {
        await window.ethereum.request({ method: "eth_requestAccounts" })

        connectButton.innerHTML = "your Meta Mask is connected"
    } else {
        connectButton.innerHTML = "Please connect Meta Mask"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

//fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}`)
    if (typeof window.ethereum !== undefined) {
        //provider/ connection to the blovkchain
        //signer/wallet/ someone with some gas
        //contract that we are interrrracting with ABI , Adress
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })

            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

//withdraw

async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
        console.log("withdrawing")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
