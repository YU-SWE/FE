import React, { createContext, useState } from 'react';

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogin = () => {
        setLoggedIn(true);
        localStorage.setItem('token', 'dummy-token');
    };

    const handleLogout = () => {
        setLoggedIn(false);
        localStorage.removeItem('token');
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        console.log(`Search query: ${query}`);
    };

    return (
        <HeaderContext.Provider
            value={{ loggedIn, handleLogin, handleLogout, searchQuery, handleSearch }}
        >
            {children}
        </HeaderContext.Provider>
    );
};
