import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const StoreConfigContext = createContext();

export const useStoreConfig = () => {
    return useContext(StoreConfigContext);
};

export const StoreConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        site_name: 'Yemeni Market',
        site_logo: '',
        stripe_public_key: '',
        loading: true
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/config`);
                setConfig({ ...response.data, loading: false });
            } catch (error) {
                console.error("Failed to load store config:", error);
                setConfig(prev => ({ ...prev, loading: false }));
            }
        };

        fetchConfig();
    }, []);

    return (
        <StoreConfigContext.Provider value={config}>
            {children}
        </StoreConfigContext.Provider>
    );
};
