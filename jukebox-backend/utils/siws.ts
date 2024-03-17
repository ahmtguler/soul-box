import type {
    SolanaSignInInput,
    SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";

const CreateSignInData = async (): Promise<SolanaSignInInput> => {
    const now: Date = new Date();
    const uri = window.location.href;
    const currentUrl = new URL(uri);
    const domain = currentUrl.host;

    const currentDateTime = now.toISOString();

    const _nonce = Math.random().toString(36).substring(2, 15);

    const signInData: SolanaSignInInput = {
        domain,
        statement:
            "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.",
        version: "1",
        nonce: _nonce,
        chainId: "mainnet",
        issuedAt: currentDateTime,
    };

    return signInData;
};

function VerifySIWS(
    input: SolanaSignInInput,
    output: SolanaSignInOutput
): boolean {
    const serialisedOutput: SolanaSignInOutput = {
        account: {
            ...output.account,
            publicKey: new Uint8Array(output.account.publicKey),
        },
        signature: new Uint8Array(output.signature),
        signedMessage: new Uint8Array(output.signedMessage),
    };
    return verifySignIn(input, serialisedOutput);
}

module.exports = {VerifySIWS, CreateSignInData};
