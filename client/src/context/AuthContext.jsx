import React, { createContext, useReducer, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

const initialState = {
    token: localStorage.getItem('gov_portal_token'),
    isAuthenticated: null,
    loading: true,
    user: null
};

function authReducer(state, action) {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'LOGIN_SUCCESS':
            localStorage.setItem('gov_portal_token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'AUTH_ERROR':
        case 'LOGOUT':
            localStorage.removeItem('gov_portal_token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default:
            return state;
    }
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const loadUser = async () => {
        if (localStorage.getItem('gov_portal_token')) {
            try {
                const res = await api.get('/auth/me');
                dispatch({ type: 'USER_LOADED', payload: res.data });
            } catch (err) {
                dispatch({ type: 'AUTH_ERROR' });
            }
        } else {
            dispatch({ type: 'AUTH_ERROR' });
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = (token, user) => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            logout,
            loadUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
