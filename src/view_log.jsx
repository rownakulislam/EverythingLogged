import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './view_log.css';

const client = create({
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http',
});

function ViewLogComponent() {
    const [userAddress, setUserAddress] = useState('');
    const [filelogs, setFileLogs] = useState([]);
  
    const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;  
    const API_KEY = process.env.REACT_APP_API_KEY;
    const PRIVATE_KEYA=process.env.REACT_APP_PRIVATE_KEY_A;
    const PRIVATE_KEY1=process.env.REACT_APP_PRIVATE_KEY_1;
    const PRIVATE_KEY2=process.env.REACT_APP_PRIVATE_KEY_2;
  
  
    const network = 'maticmum';
    const provider = new ethers.providers.AlchemyProvider(network, API_KEY);
    const signer = new ethers.Wallet(PRIVATE_KEYA, provider);
  
    
  
  
    const contractABI = require('./abis/Temp.json');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  
    async function fetchLog() {
      try {


      const userData=await contract.getUserCid();
      

        
        console.log(userData);
        let logs=[];
        for(var i=0;i<userData.length;i++){
          const lastAccessor = await contract.getLastAccessor(userData[i].toString());
          
          console.log(lastAccessor);
          for(var j=0;j<lastAccessor.length;j++){
            logs.push({ cid: userData[i], accessed_by:lastAccessor[j].user, time: lastAccessor[j].time,granted: lastAccessor[j].granted,operation: lastAccessor[j].operation})
          }
      }
      setFileLogs(logs);
      } catch (error) {
        console.error('Error fetching file from IPFS:', error);
      }
    }
    return (
        <div>
          <button className='f_b' onClick={fetchLog}>Fetch Files Logs</button>
          <div className='card_container'></div>
          {filelogs.map((file, index) => (
            <div className='card' key={index}>
              <p>Encrypted CID: {file.cid.toString()}</p>
              <p>Accessed_by: {file.accessed_by.toString()}</p>
              <p>Time: {file.time.toString()}</p>
              <p>Granted: {file.granted.toString()}</p>
              <p>Operation: {file.operation.toString()}</p>
            </div>
          ))}
          <div className='link_to_view'>
            <div className='b_page'>{<Link to="/view">Go to View</Link>}</div>
            <div className='b_page'>{<Link to="/">Go to Upload</Link>}</div>
            <div className='b_page'>{<Link to="/view">Permitted files</Link>}</div>
          <div className='b_page'>{<Link to="/grant_access">Grant Access</Link>}</div>
          <div className='b_page'>{<Link to="/revoke_access">Revoke Access</Link>}</div>
          <div className='b_page'>{<Link to="/view_reqs">View Requests</Link>}</div>
          </div>
        </div>
      );
    }
    
    export default ViewLogComponent;