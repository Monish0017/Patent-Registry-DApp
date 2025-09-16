import axios from "axios";

// Pinata API credentials from environment variables
// In React, environment variables must be prefixed with REACT_APP_
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;

const pinataConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_KEY
  }
};

export async function uploadFile(file) {
  try {
    if (!PINATA_API_KEY || PINATA_API_KEY === "YOUR_PINATA_API_KEY") {
      throw new Error("Please set your Pinata API credentials in src/ipfs.js");
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Optional: Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'patent-document',
        uploadedAt: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);

    // Optional: Pin options
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    console.log("Uploading file to Pinata IPFS:", file.name);
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      pinataConfig
    );

    const ipfsHash = response.data.IpfsHash;
    console.log("File uploaded successfully. IPFS Hash:", ipfsHash);
    
    return ipfsHash;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    if (error.response) {
      console.error("Pinata error response:", error.response.data);
      throw new Error(`Pinata upload failed: ${error.response.data.error || error.response.statusText}`);
    }
    throw error;
  }
}

export function getIPFSUrl(hash) {
  return `https://ipfs.io/ipfs/${hash}`;
}

export function getPinataGatewayUrl(hash) {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

export function getIPFSGatewayUrl(hash) {
  return `https://ipfs.io/ipfs/${hash}`;
}

// Function to test Pinata connection
export async function testPinataConnection() {
  try {
    const response = await axios.get(
      'https://api.pinata.cloud/data/testAuthentication',
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Pinata connection test failed:", error);
    throw error;
  }
}