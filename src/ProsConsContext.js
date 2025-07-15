import React, { createContext, useContext } from 'react';
import { useProsCons } from './hooks/useProsCons';

const ProsConsContext = createContext();

export const useProsConsContext = () => useContext(ProsConsContext);

export const ProsConsProvider = ({ children }) => {
    const prosCons = useProsCons();
    return (
        <ProsConsContext.Provider value={prosCons}>
            {children}
        </ProsConsContext.Provider>
    );
};
