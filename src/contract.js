import { ethers } from "ethers";
import PatentRegistryABI from "./PatentRegistryABI.json";

// Contract address from environment variables
// In React, environment variables must be prefixed with REACT_APP_
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
// console.log(CONTRACT_ADDRESS);
export const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, PatentRegistryABI, signer);
  } catch (error) {
    console.error("Error connecting to contract:", error);
    return null;
  }
};

export const getProvider = () => {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
};

export const checkNetwork = async () => {
  if (!window.ethereum) return false;
  
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  // Sepolia testnet chainId is 0xaa36a7 (11155111 in decimal)
  return chainId === '0xaa36a7';
};