import { useState, useEffect } from "react";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import registryAbi from "./registry.json";
import { useRefresh } from "./utils";

export const connectWithMetamask = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  if (accounts.length > 0) return accounts[0];
  return null;
};

export const useChainId = (isReady) => {
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const _chainId = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(new BigNumber(_chainId).toNumber());
    };

    if (isReady) {
      fetch();

      window.ethereum.on("chainChanged", (_chainId) => {
        setChainId(new BigNumber(_chainId).toNumber());
      });
    }
  }, [isReady]);

  return chainId;
};

export const useBalance = (isReady) => {
  const { fastRefresh } = useRefresh();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const web3 = new Web3(window.ethereum);
      const account = await connectWithMetamask();
      if (account) {
        const bal = await web3.eth.getBalance(account);
        setBalance(new BigNumber(bal).dividedBy(new BigNumber(10).pow(18)).toFixed(4));
      }
    };

    if (isReady) fetch();
  }, [fastRefresh, isReady]);

  return balance;
};

export const setName = (account, name) =>
  getContract()
    .methods.setName(name)
    .send({
      from: account,
      gas: 300000,
    });

export const readName = (account) =>
  getContract().methods.readName(account).call();

const getContract = () => {
  const web3 = new Web3(window.ethereum);

  return new web3.eth.Contract(
    registryAbi,
    "0xEF8773985765F9C2C8De5ff23ad1c3114B3B15dd"
  );
};
