import React, { useCallback } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
    PhantomWalletAdapter,
    LedgerWalletAdapter,
    SolflareWalletAdapter,
    BitgetWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

// eslint-disable-next-line react/prop-types
const SolanaProvider = ({ children }) => {
    const toWalletAdapterNetwork = {
        Devnet: "devnet",
    };

    let dappType = toWalletAdapterNetwork["Devnet"];

    let endpoint = clusterApiUrl(dappType);

    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new BitgetWalletAdapter(),
        new LedgerWalletAdapter(),
    ];

    const autoSignIn = useCallback(async (adapter) => {
        // If the signIn feature is not available, return true
        if (!("signIn" in adapter)) return true;
      
        // Fetch the signInInput from the backend
        const createResponse = await fetch("/backend/createSignInData"); //todo: change this to the backend server
      
        const input= await createResponse.json();
      
        // Send the signInInput to the wallet and trigger a sign-in request
        const output = await adapter.signIn(input);
      
        // Verify the sign-in output against the generated input server-side
        let strPayload = JSON.stringify({ input, output });
        const verifyResponse = await fetch("/backend/verifySIWS", {
          method: "POST",
          body: strPayload,
        });
        const success = await verifyResponse.json();
      
        // If verification fails, throw an error
        if (!success) throw new Error("Sign In verification failed!");
      
        return false;
      }, []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={autoSignIn}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default SolanaProvider;
