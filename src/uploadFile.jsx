import React, { useRef, useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import CryptoJS from 'crypto-js';


const client = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
});


function UploadFileComponent() {

  function encrypt(plaintext, secret) {
    var key = CryptoJS.enc.Utf8.parse(secret);
    let iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
    //console.log("IV : " + CryptoJS.enc.Base64.stringify(iv));
  
    var cipherText = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
      });
  return cipherText.toString();
  }
  
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




  const fileInput = useRef(null);
  const [fileCid, setFileCid] = useState(null);
  //const [userAddress, setUserAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientOperation, setRecipientOperation] = useState('');

  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;  
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PRIVATE_KEYA=process.env.REACT_APP_PRIVATE_KEY_A;
  const PRIVATE_KEY1=process.env.REACT_APP_PRIVATE_KEY_1;
  const PRIVATE_KEY2=process.env.REACT_APP_PRIVATE_KEY_2;
  const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

  const temp="tota";
  var encrypted = encrypt(temp, process.env.REACT_APP_ENCRYPTION_KEY);
  //console.log(encrypted);
  var decrypted=decrypt(encrypted,process.env.REACT_APP_ENCRYPTION_KEY);
  //console.log(decrypted);





  async function handleUploadToIPFS() {
    const file = fileInput.current.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const enee=encrypt((await client.add(reader.result)).cid.toString(), process.env.REACT_APP_ENCRYPTION_KEY);
        console.log(enee);
        
        setFileCid(enee);
      };
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const handleSendToContract = async () => {
    try {
      const network = 'maticmum';
      const provider = new ethers.providers.AlchemyProvider(network, API_KEY);
      const signer = new ethers.Wallet(PRIVATE_KEYA, provider);

      const contractABI = require('./abis/Temp.json');

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const start = performance.now();
      const transaction = await contract.setUserData(fileCid, recipientAddress, recipientOperation);
      const end = performance.now();
      console.log('Execution time: ' + (end - start) + ' milliseconds');

      await transaction.wait();
      console.log('Transaction successful');
      console.log(fileCid);
    } catch (error) {
      console.error('Error sending to contract:', error);
    }
  };

  return (
    <div>
      <div>
      <input type="file" ref={fileInput} />
      <button className='b' onClick={handleUploadToIPFS}>Upload to IPFS</button>
      </div>
      <div>
      <input
        type="text"
        placeholder="Recipient Address"
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Allowed Operation"
        onChange={(e) => setRecipientOperation(e.target.value)}
      />
      </div>
      <button className='b' onClick={handleSendToContract}>Upload data and access permission</button>
    </div>
  );
}

export default UploadFileComponent;