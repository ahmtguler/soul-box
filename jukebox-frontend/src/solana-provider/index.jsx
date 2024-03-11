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

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default SolanaProvider;
