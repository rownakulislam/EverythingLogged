//Viewing data from blockchain
require('dotenv').config(); // Load environment variables from a .env file
const { ethers } = require("hardhat");

async function main() {
  const API_KEY = "rdO0i4o--THH81mB5V3Cb9SE1UiwCtrh";
  const PRIVATE_KEY = "ffce87da659a88c5ad63d447fff3be4308b00845bf002861ba91ad0ce5994603";
  const CONTRACT_ADDRESS = "0x9e948d9CC2731Ec87e53a7D6744Be41C060B0eA9";

  if (!API_KEY || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.error("API_KEY, PRIVATE_KEY, or CONTRACT_ADDRESS is missing in the environment variables.");
    return;
  }

  const network = "maticmum";
  const alchemyProvider = new ethers.providers.AlchemyProvider(network, API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
  const contract = require("../src/abis/Temp.json"); // Replace with the actual path to your contract's artifact
  const CertContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

  const studentAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with the student's address
  const certificate = await CertContract.getUserData(studentAddress);

  console.log("cid:", certificate.ipfsCID); 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
