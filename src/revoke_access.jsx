import React, { useRef, useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './revoke_access.css';

const client = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
});

function RevokeAccessComponent() {
  const fileInput = useRef(null);
  const [fileCid, setFileCid] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientOperation, setRecipientOperation] = useState('');

  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;  
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PRIVATE_KEYA=process.env.REACT_APP_PRIVATE_KEY_A;
  const PRIVATE_KEY1=process.env.REACT_APP_PRIVATE_KEY_1;
  const PRIVATE_KEY2=process.env.REACT_APP_PRIVATE_KEY_2;

  

  const handleRevokeAccess = async () => {
    try {
      const network = 'maticmum';
      const provider = new ethers.providers.AlchemyProvider(network, API_KEY);
      const signer = new ethers.Wallet(PRIVATE_KEYA, provider);
  
      const contractABI = require('./abis/Temp.json');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  
      const transaction = await contract.revokeAccess(recipientAddress);
      transaction.wait();
      console.log('Revoked access from the recepient for all files');
     
    } catch (error) {
      console.error('Error granting access:', error);
    }
  };

  return (
    <div>
      <div>
      <input
        type="text"
        placeholder="Recipient Address"
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      </div>
      <button className='b' onClick={handleRevokeAccess}>Revoke user from all files</button>
        <div className='link_to_view'>

            <div className='b_page'>{<Link to="/">Go to Upload</Link>}</div>
            <div className='b_page'>{<Link to="/view">Permitted files</Link>}</div>
          <div className='b_page'>{<Link to="/view_log">Go to View Logs</Link>}</div>
          <div className='b_page'>{<Link to="/grant_access">Grant Access</Link>}</div>
          <div className='b_page'>{<Link to="/view_reqs">View Requests</Link>}</div>

        </div>
    </div>
  );
}

export default RevokeAccessComponent;