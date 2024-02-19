import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from '../../../../declarations/attendance_proof_system_backend/index';
import AdminLogin from '../Auth/AdminLogin';
import Login from '../Auth/Login';
import Navbar from '../layouts/Navbar';

const AuthContext = createContext();

export const useAuthClient = () => {
    const [authClient, setAuthClient] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [backendActor, setBackendActor] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    const backendCanisterId =
        process.env.CANISTER_ID_ATTENDANCE_PROOF_SYSTEM_BACKEND ||
        process.env.ATTENDANCE_PROOF_SYSTEM_BACKEND_CANISTER_ID;

    const frontendCanisterId =
        process.env.CANISTER_ID_ATTENDANCE_PROOF_SYSTEM_FRONTEND ||
        process.env.ATTENDANCE_PROOF_SYSTEM_FRONTEND_CANISTER_ID;

    const clientInfo = async (client) => {
        const isAuthenticated = await client.isAuthenticated();
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();

        setAuthClient(client);
        setIsAuthenticated(isAuthenticated);
        setIdentity(identity);
        setPrincipal(principal);

        if (isAuthenticated && identity && principal && principal.isAnonymous() === false && backendCanisterId) {
            let backendActor = createActor(backendCanisterId, { agentOptions: { identity: identity } });
            setBackendActor(backendActor);
            setIsAdmin(await backendActor.isAdmin());
        }

        return true;
    }

    useEffect(() => {
        (async () => {
            const authClient = await AuthClient.create();
            clientInfo(authClient);
        })();
    }, []);

    const login = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (authClient.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false)) {
                    resolve(clientInfo(authClient));
                } else {
                    await authClient.login({
                        identityProvider: process.env.DFX_NETWORK === "ic"
                            ? "https://identity.ic0.app/"
                            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                        onError: (error) => reject((error)),
                        onSuccess: () => resolve(clientInfo(authClient)),
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    return {
        login, isAdmin, authClient, isAuthenticated, identity, principal, frontendCanisterId, backendCanisterId, backendActor
    };
}

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();
    if (!auth.isAuthenticated || !auth.backendActor || auth.isAdmin === null || auth.isAdmin === undefined) {
        return (
            <AuthContext.Provider value={auth}>
                <Navbar />
                {window.location.pathname.includes("/login") ? <Login /> : <AdminLogin />}
            </AuthContext.Provider>
        )
    }
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);
