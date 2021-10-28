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
  // readName,
} from "../data/contract";

const TOAST_OPTIONS = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};
const TARGET_NETWORK = "3";

export const Header = () => {
  const [text, setText] = useState('');
  const [isLoading, setLoading] = useState(true);

  const isMetamaskEnabled = typeof window.ethereum !== "undefined";
  const chainId = useChainId(isMetamaskEnabled);
  const balance = useBalance(isMetamaskEnabled && chainId === TARGET_NETWORK);

  useEffect(() => {
    if (balance.length > 0) setLoading(false);
  }, [balance]);

  const handleSet = async (count) => {
    if (text.length  === 0) return;

    setLoading(true);
    const account = await connectWithMetamask();
    if (account === null) {
      toast.error("Account not connected", TOAST_OPTIONS);
      return;
    }
    setName(account, text)
      .on("transactionHash", () => setLoading(false))
      .on("receipt", () =>
        toast.info("Name set successfully", TOAST_OPTIONS)
      )
      .on("error", () => {
        setLoading(false);
        toast.error("Name not set. Errors occurred", TOAST_OPTIONS);
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
              ) : chainId !== TARGET_NETWORK ? (
                <span className="metamask">
                  Current network is not the target network. Please switch to
                  ropsten.
                </span>
              ) : (
                <div className="info-inner text-center">
                  <p>Balance {!balance ? "0.00" : balance} ETH</p>
                  <input className="input" value={text} onChange={e => setText(e.target.value)} />
                  <a
                    onClick={handleSet}
                    className={`btn btn-mint btn-lg page-scroll ${
                      isMetamaskEnabled ? "" : "btn-disabled"
                    }`}
                  >
                    Set Name
                  </a>
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
