import React, { createContext, useContext, useState } from "react";

const DropdownContext = createContext();

export const DropdownProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState("View");
  const [committedView, setCommittedView] = useState("Session View");

  return (
    <DropdownContext.Provider value={{ currentView, setCurrentView, committedView, setCommittedView }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => useContext(DropdownContext);
