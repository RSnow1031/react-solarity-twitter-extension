import React, { useState } from 'react';
import {
    useConnection,
    useWallet,
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const MyWallet: React.FC = () => {
    const { connection } = useConnection();
    const [ btnLoading, setBtnLoading ] = useState(false);
    let walletAddress = "";

    const wallet = useWallet();
    if (wallet.connected && wallet.publicKey) {
        walletAddress = wallet.publicKey.toString()
    }

    const paySol = async () => {
        if (!wallet.publicKey) {
            alert('Connect wallet please.');
            return;
        };
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey("6BnAzdBGmUdgcRaTaFGBvMAiAgC2cELiU5q12hBYb8YN"),
                lamports: LAMPORTS_PER_SOL / 100,
            })
        );
        try {
            setBtnLoading(true);
            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');
            setBtnLoading(false);
        } catch (error: any) {
            setBtnLoading(false);
            alert(error.message);
            return;
        }
    }

    return (
        <>
            {   (
                wallet.connected &&
                <p>Your wallet is {walletAddress}</p>
                ) || (
                    <p>Hello! Click the button to connect</p>
                )
            }

            <div className="multi-wrapper">
                <span className="button-wrapper">
                    <WalletModalProvider>
                        <WalletMultiButton />
                    </WalletModalProvider>
                    <button
                        disabled={btnLoading}
                        onClick={paySol}
                    >
                        Pay Now!
                    </button>
                </span>
                {wallet.connected && <WalletDisconnectButton />}
            </div>
        </>
    );
};

export default MyWallet;
