import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './accept_req.css';

const client = create({
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http',
});

function ViewReqComponent() {

    function isZeroAddress(address) {
        return address === '0x0000000000000000000000000000000000000000';
    }


    
        const [reqs, setReqs] = useState([]);
    
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

        async function handleAccept(cid, requester, operation) {
            try {
                const accept=await contract.accept_request(cid, requester, operation);
                await accept.wait();
                console.log("Request accepted");
            } catch (error) {
                console.error('Error accepting request:', error);
            }
        }
    
        async function fetchReqs() {
            try {
                const reqData = await contract.return_rquests();
                console.log(reqData);
                let reqs = [];
                for (var i = 0; i < reqData.length; i++) {
                    if (!isZeroAddress(reqData[i].requester)) {
                        console.log(reqData[i].operation);
                        reqs.push({ cid: reqData[i].cid, requested_by: reqData[i].requester, operation: reqData[i].operation });
                    }
                }
                setReqs(reqs);
            } catch (error) {
                console.error('Error fetching requests for files:', error);
            }
        }
        return (
            <div>
            <button className='f_b' onClick={fetchReqs}>Fetch Requests</button>
            <div className='card_container'></div>
            {reqs.map((req, index) => (
              <div className='card' key={index}>
                <p>Encrypted CID: {req.cid.toString()}</p>
                <p>Requested_by: {req.requested_by.toString()}</p>
                <p>Operation: {req.operation.toString()}</p>
                <a className='download' onClick={() => handleAccept(req.cid.toString(),req.requested_by.toString(),req.operation.toString())}>
                    Accept
                </a>
              </div>
            ))} 
            <div className='link_to_view'>
            <div className='b_page'>{<Link to="/view">Permitted files</Link>}</div>
      <div className='b_page'>{<Link to="/view_log">Go to View Logs</Link>}</div>
      <div className='b_page'>{<Link to="/grant_access">Grant Access</Link>}</div>
      <div className='b_page'>{<Link to="/revoke_access">Revoke Access</Link>}</div>

              <div className='b_page'>{<Link to="/">Go to Upload</Link>}</div>
            </div>
          </div>
        );
}
    
    export default ViewReqComponent;