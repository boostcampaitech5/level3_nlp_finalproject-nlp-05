import React, { createContext, useState } from 'react';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);

  return (
    <Context.Provider value={{ isLogin, setIsLogin, loginComplete, setLoginComplete }}>
      {children}
    </Context.Provider>
  );
};