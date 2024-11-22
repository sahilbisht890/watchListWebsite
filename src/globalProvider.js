import React, { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userWatchListData, setUserWatchListData] = useState([]);


  return (
    <GlobalContext.Provider value={{ userEmail, setUserEmail, userWatchListData, setUserWatchListData }}>
      {children}
    </GlobalContext.Provider>
  );
};
