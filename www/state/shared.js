import React, { createContext, useState, useContext } from "react";

const initialState = {
  cart: [],
};

const state = () => useState(initialState);

const Context = createContext(null);

export const useSharedState = () => {
  const value = useContext(Context);
  if (value === null) throw new Error("Please add SharedStateProvider");
  return value;
};

export const SharedStateProvider = ({ children }) => (
  <Context.Provider value={state()}>{children}</Context.Provider>
);
