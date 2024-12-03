import React, { useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
            </div>
        </div>
    );
};

export default SearchBar;