import {useState } from "react";
const ethers = require("ethers")
// import TokenContract from './TokenContract.json';

function useEthereum(){
    const [account, setAccount]= useState(null);
    const [error, setError] = useState(null);
    const [contract, setContract] = useState();
    //Function to connect metamask wallet
    const connectWallet = async () => {
        try {
          const { ethereum } = window;
          if (ethereum) {
           
            const provider = new ethers.providers.Web3Provider(ethereum);
            // find the account this will open metamask 
            const acc = await provider.send("eth_requestAccounts", []);
            console.log('Accounts => ',acc)

            // if metamask account changed reload the window
            // can add functions for network and chain change also
            window.ethereum.on("accountsChanged", () => {
              window.location.reload();
            });
  
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const TokenContract = new ethers.Contract(
              '0xa4c17C88883EE6da03F1f93F39f814E7EC36A4C7',
              TokenContract.abi,
              signer
            )
           
            const _user = await TokenContract.isUser(address)
          
            console.log(address,_user)
            setAccount(address)
            setContract(TokenContract);
          } else {
            setError('Please install metamask to continue')
          }
        } catch (err) {
          console.log('Error',err);
        }
      };

    

    return {
        connectWallet,
        account,
        error,
        contract,
        
    }
};

export default useEthereum;