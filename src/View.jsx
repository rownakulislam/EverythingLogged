import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './View.css';
import CryptoJS from 'crypto-js';

const client = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
});

function ViewComponent() {


  function decrypt(cipherText, secret) {
    var key = CryptoJS.enc.Utf8.parse(secret);
    let iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
    let ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    let iv1 = CryptoJS.enc.Base64.parse(ivBase64);
    
    var cipherBytes = CryptoJS.enc.Base64.parse(cipherText);
  
    var decrypted = CryptoJS.AES.decrypt({ciphertext: cipherBytes}, key, {
        iv: iv1,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
  
    return decrypted.toString(CryptoJS.enc.Utf8);
  }




  const [userAddress, setUserAddress] = useState('');
  const [fileUrls, setFileUrls] = useState([]);
  const [reqOp, setReqOp] = useState('');

  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;  
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PRIVATE_KEYA=process.env.REACT_APP_PRIVATE_KEY_A;
  const PRIVATE_KEY1=process.env.REACT_APP_PRIVATE_KEY_1;
  const PRIVATE_KEY2=process.env.REACT_APP_PRIVATE_KEY_2;


  const network = 'maticmum';
  const provider = new ethers.providers.AlchemyProvider(network, API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY1, provider);

  const contractABI = require('./abis/Temp.json');
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

  async function handleDelete(cid) {
    try {
      const transaction = await contract.deleteLog(cid);
      await transaction.wait();
      var d = new Date();
      d = new Date(d.getTime() - 3000000);
      
      var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
      const start = performance.now();

      
      const transaction2=await contract.updateLog(cid,date_format_str,1,"2");
      await transaction2.wait();
      const end = performance.now();
      console.log('Execution time: ' + (end - start) + ' milliseconds');
      
      console.log(cid);
      console.log('Deletion successful');
      window.location.reload(); // Reload the page
    } catch(error) {
      console.error('Error deleting', error);
    }
  }



  async function handleAccess(cid) {
    try{
      
      var d = new Date();
      d = new Date(d.getTime() - 3000000);
      var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
      
      
      const start = performance.now();

      const transaction2=await contract.updateLog(cid,date_format_str,1,"1");
      await transaction2.wait();
      const end = performance.now();
      console.log('Execution time: ' + (end - start) + ' milliseconds');
      
      console.log(cid);
      console.log('Access successful');
    }catch(error){
      console.error('Error access', error);
    }
  }


  async function handleRequest(cid,reqOp){
    try{
      console.log(reqOp);
      const transaction = await contract.requestAccess(cid,reqOp.toString());
      await transaction.wait();
      console.log('Request successful');
    }catch(error){
      console.error('Error requesting', error);
    }
  }


  async function fetchFileFromIPFS() {
    try {
      console.log("here");
      const start = performance.now();
      const transactionObj1 = await contract.getUserData(userAddress);
      const end = performance.now();
      console.log('Execution time: ' + (end - start) + ' milliseconds');
      const temp=await transactionObj1.wait();
      const userData=temp.events[0].args._cid;
      
      let urls = [];
      for(var i=0;i<userData.length;i++){
        if(userData[i].cid==""){
          continue;
        }
        console.log(userData[i].cid.toString());
        const stream = client.cat(decrypt(userData[i].cid.toString(),process.env.REACT_APP_ENCRYPTION_KEY).toString());
        let data = [];

        for await (const chunk of stream) {
          data.push(chunk);
        }
        
        const blob = new Blob(data, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        console.log(url);
        var showw=false;
        var deletee=false;
        var no_access=true;
        if(userData[i].operation=="3" || userData[i].operation=="1"){
          showw=true;
          no_access=false;
        }
        if(userData[i].operation=="2" || userData[i].operation=="3"){
          deletee=true;
          no_access=false;
        }
        urls.push({ cid: userData[i].cid, url: url,show:showw,delete:deletee,op:userData[i].operation});
    }
    setFileUrls(urls);
    } catch (error) {
      console.error('Error fetching file from IPFS:', error);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Owner Address"
        onChange={(e) => setUserAddress(e.target.value)}
      />
      
      <button className='up_b' onClick={fetchFileFromIPFS}>Fetch Files from IPFS</button>
      {fileUrls.map((file, index) => (
        <div className='file' key={index}>
          <p>Encrypted CID: {file.cid}</p>
          {file.show?<a className='download' href={file.url} download onClick={() => handleAccess(file.cid.toString())}>
              Download File
            </a>:<p className='not_accessed'>Not accessed to show</p>}
          {file.delete ? (
            <a className='download'  onClick={() => handleDelete(file.cid.toString())} >
              Delete File
            </a>
          ) : (
            <p className='not_accessed'>Not accessed to delete</p>
          )}
          {file.show === false && file.delete === false ? (
            <div>
              <input
                type="text"
                placeholder="Request Operation"
                onChange={(e) => setReqOp(e.target.value)}
              />
              <a className='download' onClick={() => handleRequest(file.cid.toString(),reqOp)}>
                Request for File
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>

      ))}
    
    <div className='link_to_view'>
      <div className='b_page'>{<Link to="/">Go to Upload</Link>}</div>
      <div className='b_page'>{<Link to="/view_log">Go to View Logs</Link>}</div>
      <div className='b_page'>{<Link to="/grant_access">Grant Access</Link>}</div>
      <div className='b_page'>{<Link to="/revoke_access">Revoke Access</Link>}</div>
      <div className='b_page'>{<Link to="/view_reqs">View Requests</Link>}</div>
    </div>
      
    </div>
  );
}

export default ViewComponent;