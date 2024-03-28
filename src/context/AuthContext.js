'use client'

import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
	signInWithPopup, // Updated method name
	signOut,
	GoogleAuthProvider
} from 'firebase/auth'; // Updated import path
import firebase_app from '../firebase/config';
import { createContext, useState, useContext, useEffect } from 'react';

const auth = getAuth(firebase_app);

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext); // Uncommented this line

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = useState(null); // Set initial state to an empty object instead of null

	const googleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider); // Updated method name
	};

	const logOut =  () => {
		signOut(auth);
	};

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
        })

        return () => unsubscribe();
    }, [user]); // Updated dependency

    return (
        <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
	return useContext(AuthContext);
}
