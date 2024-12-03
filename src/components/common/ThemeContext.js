import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    // 초기 마운트 시 시스템 다크모드 감지
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            setIsDark(e.matches);
        };

        // 시스템 설정이 변경될 때 테마 자동 변경
        mediaQuery.addEventListener('change', handleChange);

        // localStorage에 저장된 설정이 없을 경우 시스템 설정 사용
        if (!localStorage.getItem('theme')) {
            setIsDark(mediaQuery.matches);
        }

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};