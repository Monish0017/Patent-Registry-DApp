# Patent Registry DApp 🔬

A complete blockchain-based patent registration system built with React, Ethereum smart contracts, and IPFS storage.

## Features ✨

- 🦊 **MetaMask Integration** - Connect your wallet seamlessly
- 📝 **Patent Registration** - Register patents on the blockchain
- 📁 **IPFS Storage** - Decentralized file storage via Pinata
- 🔍 **Patent Viewing** - View all your registered patents
- 🌐 **Responsive Design** - Works on desktop and mobile
- ⚡ **Real-time Updates** - Live transaction status updates

## Tech Stack 🛠️

- **Frontend**: React 18
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Storage**: IPFS via Pinata (1GB free tier)
- **Wallet**: MetaMask
- **Styling**: Modern CSS with gradients and animations

## Setup Instructions 🚀

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Pinata IPFS
1. Sign up at [https://www.pinata.cloud](https://www.pinata.cloud) (free 1GB tier)
2. Go to API Keys section and create a new key
3. Copy your API Key and Secret Key
4. Replace `YOUR_PINATA_API_KEY` and `YOUR_PINATA_SECRET_KEY` in `src/ipfs.js`

### 3. Deploy Smart Contract
1. Use the contract from your Remix IDE
2. Deploy to Sepolia testnet
3. Replace `0xYourDeployedContractAddress` in `src/contract.js` with your deployed contract address

### 4. Run the Application
```bash
npm start
```

## Usage Guide 📖

### Connect Wallet
1. Click "🦊 Connect MetaMask" 
2. Make sure you're on Sepolia testnet
3. Approve the connection

### Register a Patent
1. Fill in the patent title and description
2. Upload a document (PDF, DOC, images supported)
3. Click "🚀 Register Patent"
4. Confirm the transaction in MetaMask
5. Wait for confirmation

### View Patents
1. Click "🔄 Refresh" to load your patents
2. Click "📄 View Document" to open files from IPFS
3. All your registered patents will be displayed with details

## Smart Contract Functions 📋

- `registerPatent(title, description, fileHash)` - Register a new patent
- `getPatent(patentId)` - Get patent details by ID
- `getMyPatents()` - Get all patent IDs owned by caller
- `patentCount()` - Get total number of patents

## File Structure 📁

```
src/
├── App.js                 # Main React component
├── App.css                # Styling
├── contract.js            # Blockchain interaction
├── ipfs.js                # IPFS file upload
├── PatentRegistryABI.json # Smart contract ABI
├── index.js               # React entry point
└── index.css              # Global styles
```

## Requirements 📋

- Node.js 16+
- MetaMask browser extension
- Sepolia testnet ETH (get from faucet)
- Pinata API credentials (free 1GB storage)

## Features in Detail 🔍

### Wallet Connection
- Automatic detection of MetaMask
- Network validation (Sepolia only)
- Account display with truncated address

### Patent Registration
- Form validation
- File upload to IPFS
- Blockchain transaction handling
- Real-time status updates
- Transaction confirmation waiting

### Patent Display
- Grid layout for multiple patents
- Patent details with timestamps
- Direct IPFS links to documents
- Responsive design

## Security Notes 🔒

- All patents are permanently stored on blockchain
- Files are stored on IPFS (decentralized)
- Only patent owners can view their patents
- MetaMask handles private key security

## Troubleshooting 🔧

### Common Issues
1. **MetaMask not detected**: Install MetaMask extension
2. **Wrong network**: Switch to Sepolia testnet in MetaMask
3. **Transaction failed**: Check you have enough ETH for gas
4. **IPFS upload failed**: Verify your Pinata API credentials
5. **Contract not found**: Check contract address is correct

### Getting Pinata API Keys
1. Sign up at https://www.pinata.cloud
2. Go to "API Keys" in your dashboard
3. Click "New Key" and give it a name
4. Copy both the API Key and API Secret
5. Paste them in `src/ipfs.js`

### Getting Testnet ETH
- Use Sepolia faucet: https://sepoliafaucet.com/
- You need a small amount for gas fees

## Future Enhancements 🚀

- [ ] Patent search functionality
- [ ] Patent marketplace
- [ ] Multi-file upload support
- [ ] Patent verification system
- [ ] Integration with other blockchains
- [ ] Patent licensing features

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

MIT License - feel free to use this project for learning and development.

---

Built with ❤️ by the blockchain community