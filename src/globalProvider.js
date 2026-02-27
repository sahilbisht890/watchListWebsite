import React, { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [userKey, setUserKey] = useState('');
  const [userWatchListData, setUserWatchListData] = useState([]);


  return (
    <GlobalContext.Provider value={{ userKey, setUserKey, userWatchListData, setUserWatchListData }}>
      {children}
    </GlobalContext.Provider>
  );
};
