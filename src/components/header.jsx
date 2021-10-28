/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  connectWithMetamask,
  useChainId,
  useBalance,
  setName,
  readName,
} from "../data/contract";

const TOAST_OPTIONS = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};
const NETWORK_NAMES = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  42: "Kovan",
}
const TARGET_NETWORK = 3;

export const Header = () => {
  const [nameText, setNameText] = useState('');
  const [addrText, setAddrText] = useState('');
  const [nameShow, setNameShow] = useState('');
  const [isLoading, setLoading] = useState(true);

  const isMetamaskEnabled = typeof window.ethereum !== "undefined";
  const chainId = useChainId(isMetamaskEnabled);
  const balance = useBalance(isMetamaskEnabled);

  useEffect(() => {
    if (balance.length > 0) setLoading(false);
  }, [balance]);

  const handleSet = async () => {
    if (nameText.length === 0) return;
    if (chainId !== TARGET_NETWORK) {
      toast.info("Current network is not ropsten.", TOAST_OPTIONS);
      return;
    }

    setLoading(true);
    const account = await connectWithMetamask();
    if (account === null) {
      toast.error("Account not connected", TOAST_OPTIONS);
      return;
    }

    setName(account, nameText)
      .on("receipt", () => {
        setLoading(false);
        toast.success("Name set successfully", TOAST_OPTIONS);
      })
      .on("error", (error) => {
        setLoading(false);
        toast.error("Name already used", TOAST_OPTIONS);
      });
  };

  const handleRead = async () => {
    if (addrText.trim().length !== 42) {
      toast.error("Invalid address", TOAST_OPTIONS);
      return;
    }
    if (chainId !== TARGET_NETWORK) {
      toast.info("Current network is not ropsten.", TOAST_OPTIONS);
      return;
    }

    setLoading(true);
    readName(addrText).then((name) => {
      setLoading(false);
      setNameShow(name || 'unregistered');
    });
  };

  return (
    <div id="header">
      <div className="container">
        <div className="row">
          {isLoading && <div className="loader" />}
          <div className="col-xs-12 col-md-6">
            <div className="info-outer">
              {!isMetamaskEnabled ? (
                <span className="metamask">
                  Please install Metamask for proper use.
                </span>
              ) : (
                <div className="info-inner text-center">
                  <p>{chainId && NETWORK_NAMES[chainId]}</p>
                  <p>Balance {!balance ? "0.00" : balance} ETH</p>
                  <input className="input" value={nameText} onChange={e => setNameText(e.target.value)} />
                  <a
                    onClick={handleSet}
                    className={`btn btn-mint btn-lg page-scroll ${
                      isMetamaskEnabled ? "" : "btn-disabled"
                    }`}
                  >
                    Set Name
                  </a>
                  <input className="input" value={addrText} onChange={e => setAddrText(e.target.value)} />
                  <a
                    onClick={handleRead}
                    className={`btn btn-mint btn-lg page-scroll ${
                      isMetamaskEnabled ? "" : "btn-disabled"
                    }`}
                  >
                    Read Name
                  </a>
                  <p>{`>${nameShow}<`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
