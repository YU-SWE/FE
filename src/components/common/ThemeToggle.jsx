import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="login-button"
            style={{
                backgroundColor: '#26baa4',
                fontSize: '14px',
                fontWeight: '500'
            }}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
            {isDark ? 'light mode' : 'dark mode'}
        </button>
    );
};

export default ThemeToggle;