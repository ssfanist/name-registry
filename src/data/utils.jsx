/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useState, useEffect } from "react";

const FAST_INTERVAL = 10000;
const SLOW_INTERVAL = 100000;

const RefreshContext = createContext({ fast: 0, slow: 0 });

export const RefreshContextProvider = ({ children }) => {
  const [fast, setFast] = useState(0);
  const [slow, setSlow] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      setFast((prev) => prev + 1);
    }, FAST_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlow((prev) => prev + 1);
    }, SLOW_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <RefreshContext.Provider value={{ fast, slow }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const { slow, fast } = useContext(RefreshContext);
  return { slowRefresh: slow, fastRefresh: fast };
};
