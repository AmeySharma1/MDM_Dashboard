import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load session on mount
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('mdm_session');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (err) {
            console.error('Failed to restore session:', err);
            localStorage.removeItem('mdm_session');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback((username, password) => {
        // Normalizing inputs to prevent trivial mismatches
        const normalizedUsername = username.trim();
        const normalizedPassword = password.trim();

        if (normalizedUsername === 'Admin' && normalizedPassword === 'Admin123') {
            const userData = {
                name: 'System Architect',
                username: 'Admin',
                role: 'L0 - PRIVILEGED',
                loginTime: new Date().toISOString()
            };

            setUser(userData);
            localStorage.setItem('mdm_session', JSON.stringify(userData));
            return { success: true };
        }

        return { success: false, message: 'Invalid Administrative Credentials' };
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('mdm_session');
        // Force a reload to clear any residual states if necessary, 
        // but React state update should be enough.
    }, []);

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
