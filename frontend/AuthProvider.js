import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    //const [token, setToken] = useState(null);

    const login = async (email, password) => {
        try {
            let userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);

            let user = userCredential.user;
            if (!user?.uid) {
                let msg = `No UID found after signIn!`;
                console.error(msg);
            }
            if (user) {
                console.log(`Logged in as uid(${user.uid}) email(${user.email})`);
            }

            setUser({ ...user, id: user.uid, email: user.email });
        } catch (ex) {
            let msg = `Login failure for email(${email}: ${ex.message})`;
            console.error(msg);
        }
    };

    const register = async (name, email, password) => {
        try {
            let userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);

            let user = userCredential.user;
            if (!user?.uid) {
                let msg = `No UID found after register!`;
                console.error(msg);
            }
            if (user) {
                console.log(`Logged in as uid(${user.uid}) email(${user.email})`);
            }

            setUser({ id: user.uid, email: user.email, name: name });

            updateProfile(user, {
                displayName: name
            })

            return userCredential;
        } catch (ex) {
            let msg = `Login failure for email(${email}: ${ex.message})`;
            console.error(msg);
        }

    }

    const logout = async () => {
        try {
            setUser(null);
            await FIREBASE_AUTH.signOut();
        } catch (ex) {
            console.error(ex);
        }
    };

    useEffect(() => {
        let unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
            if (user) {
                console.log(" ----------- user ", user)
                setUser({ id: user.uid, email: user.email, name: user.displayName });
            }
        });

        return unsubscribe;
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};

