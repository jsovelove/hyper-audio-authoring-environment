import React, { createContext, useState, useContext } from 'react';

export const AttributesContext = createContext();

export const AttributesProvider = ({ children }) => {
    const [globalAttributes, setGlobalAttributes] = useState({});
    const [nodeLinks, setNodeLinks] = useState({}); // state to track the links between nodes

    return (
        <AttributesContext.Provider value={{ globalAttributes, setGlobalAttributes, nodeLinks, setNodeLinks }}>
            {children}
        </AttributesContext.Provider>
    );
};

export const useAttributes = () => {
    const context = useContext(AttributesContext);
    console.log(context);
    if (context === undefined) {
        throw new Error('useAttributes must be used within a AttributesProvider');
    }
    return context;
};
