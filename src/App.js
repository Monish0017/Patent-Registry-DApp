import React, { useState, useEffect } from "react";
import { getContract, checkNetwork } from "./contract";
import { uploadFile, getIPFSUrl, testPinataConnection } from "./ipfs";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [patents, setPatents] = useState([]);
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    // Test Pinata connection on app load
    testPinataConnection()
      .then(() => {
          setStatus("Pinata IPFS connection ready");
          fetchMyPatents();
        })
      .catch(() => setStatus("Please configure Pinata API keys in src/ipfs.js"));
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setStatus("Wallet connected");
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const networkOk = await checkNetwork();
      if (!networkOk) {
        setStatus("Please switch to Sepolia testnet in MetaMask");
        return;
      }

      setAccount(accounts[0]);
      setIsConnected(true);
      setStatus("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus("Failed to connect wallet");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setStatus(`File selected: ${selectedFile.name}`);
    }
  };

  const registerPatent = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first");
      return;
    }

    if (!title.trim() || !description.trim() || !file) {
      setStatus("Please fill all fields and select a file");
      return;
    }

    setLoading(true);
    try {
      setStatus("Uploading file to Pinata IPFS...");
      const fileHash = await uploadFile(file);

      setStatus("Connecting to smart contract...");
      const contract = await getContract();
      if (!contract) {
        setStatus("Failed to connect to contract");
        setLoading(false);
        return;
      }

      setStatus("Registering patent on blockchain...");
      const tx = await contract.registerPatent(title.trim(), description.trim(), fileHash);
      
      setStatus("Waiting for transaction confirmation...");
      const receipt = await tx.wait();

      setStatus(`Patent registered successfully! IPFS Hash: ${fileHash}`);
      
      // Clear form
      setTitle("");
      setDescription("");
      setFile(null);
      document.getElementById("fileInput").value = "";
      
      // Refresh patents list
      setTimeout(() => fetchMyPatents(), 2000);
      
    } catch (error) {
      console.error("Error registering patent:", error);
      if (error.message.includes("Pinata")) {
        setStatus("IPFS Upload Error: " + error.message);
      } else {
        setStatus("Error: " + (error.message || "Transaction failed"));
      }
    }
    setLoading(false);
  };

  const fetchMyPatents = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      setStatus("Fetching your patents...");
      const contract = await getContract();
      if (!contract) {
        setStatus("Failed to connect to contract");
        setLoading(false);
        return;
      }

      const ids = await contract.getMyPatents();
      let results = [];
      
      for (let id of ids) {
        try {
          const patent = await contract.getPatent(id);
          results.push({
            id: patent[0].toString(),
            title: patent[1],
            description: patent[2],
            fileHash: patent[3],
            owner: patent[4],
            timestamp: new Date(Number(patent[5]) * 1000).toLocaleString(),
          });
        } catch (error) {
          console.error(`Error fetching patent ${id}:`, error);
        }
      }
      
      setPatents(results);
      setStatus(`Loaded ${results.length} patent(s)`);
    } catch (error) {
      console.error("Error fetching patents:", error);
      setStatus("Error fetching patents: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Patent Registry DApp</h1>
        <p>Blockchain-based patent registration with Pinata IPFS storage</p>
      </header>

      <main className="App-main">
        {/* Wallet Connection */}
        <div className="wallet-section">
          {!isConnected ? (
            <button className="connect-btn" onClick={connectWallet}>
              Connect MetaMask
            </button>
          ) : (
            <div className="wallet-info">
              <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>
          )}
        </div>

        {isConnected && (
          <>
            {/* Patent Registration Form */}
            <section className="register-section">
              <h2>Register New Patent</h2>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Patent Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <textarea
                  placeholder="Patent Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea-field"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
                <label htmlFor="fileInput" className="file-label">
                  Choose Patent Document
                </label>
                {file && <span className="file-name">{file.name}</span>}
              </div>

              <button 
                className="register-btn" 
                onClick={registerPatent}
                disabled={loading}
              >
                {loading ? "Processing..." : "Register Patent"}
              </button>
            </section>

            {/* Patents List */}
            <section className="patents-section">
              <div className="patents-header">
                <h2>My Patents</h2>
                <button 
                  className="fetch-btn" 
                  onClick={fetchMyPatents}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {patents.length > 0 ? (
                <div className="patents-grid">
                  {patents.map((patent) => (
                    <div key={patent.id} className="patent-card">
                      <h3>{patent.title}</h3>
                      <p className="patent-description">{patent.description}</p>
                      <div className="patent-details">
                        <p><strong>ID:</strong> #{patent.id}</p>
                        <p><strong>Owner:</strong> {patent.owner.slice(0, 6)}...{patent.owner.slice(-4)}</p>
                        <p><strong>Date:</strong> {patent.timestamp}</p>
                        <a
                          href={getIPFSUrl(patent.fileHash)}
                          target="_blank"
                          rel="noreferrer"
                          className="ipfs-link"
                        >
                          View Document
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-patents">No patents registered yet.</p>
              )}
            </section>
          </>
        )}

        {/* Status */}
        <div className="status-section">
          <p className="status">{status}</p>
        </div>
      </main>

      <footer className="App-footer">
        <p>Built with React, Ethereum & Pinata IPFS</p>
      </footer>
    </div>
  );
}

export default App;