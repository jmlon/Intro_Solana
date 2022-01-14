import { clusterApiUrl, Connection, PublicKey, RpcResponseAndContext, SignatureResult, SystemProgram, Transaction } from '@solana/web3.js';
import { FC, useEffect, useRef, useState } from 'react';
import { PhantomProvider } from './ConnectWallet';

interface ITransferSolProps {
    provider: PhantomProvider;
}

const network = "devnet";

const defaultDest = 'A3gWSs3vB6T1hwbEP5ENJgnydBJzH3TL1QjPWASYkDbK';

const TransferSol: FC<ITransferSolProps> = (props) => {

    // Create a connection to blockchain and
    // make it persistent across renders
    const connection = useRef(new Connection(clusterApiUrl(network)));

    const [ destAddr, setDestAddr ] = useState(defaultDest);
    const [ lamports, setLamports ] = useState(10000);
    const [ txid, setTxid ] = useState<string | null>(null);
    const [ slot, setSlot ] = useState<number | null>(null);
    const [ myBalance, setMyBalance ] = useState(0);
    const [ rxBalance, setRxBalance ] = useState(0);

    // Get the balance the first time the component is mounted
    useEffect( () => {
        connection.current.getBalance(props.provider.publicKey).then(setMyBalance);
    }, [props.provider.publicKey]);

    useEffect( () => {
        connection.current.getBalance(new PublicKey(destAddr)).then(setRxBalance);
    }, [destAddr]);

    const handleChangeAddr = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDestAddr(event.target.value);
    }

    const handleChangeLamp = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLamports(parseInt(event.target.value));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Create a TX object
        let transaction = new Transaction({
            feePayer: props.provider.publicKey,
            recentBlockhash: (await connection.current.getRecentBlockhash()).blockhash
        });

        // Add instructions to the tx
        transaction.add(
            SystemProgram.transfer({
            fromPubkey: props.provider.publicKey,
            toPubkey: new PublicKey(destAddr),
            lamports: lamports,
            })
        );
        
        // Get the TX signed by the wallet (signature stored in-situ)
        await props.provider.signTransaction(transaction);

        // Send the TX to the network
        connection.current.sendRawTransaction(transaction.serialize())
        .then(id => {
            console.log(`Transaction ID: ${id}`);
            setTxid(id);
            connection.current.confirmTransaction(id)
            .then((confirmation: RpcResponseAndContext<SignatureResult>) => {
                console.log(`Confirmation slot: ${confirmation.context.slot}`);
                setSlot(confirmation.context.slot);
                connection.current.getBalance(props.provider.publicKey).then(setMyBalance);
                connection.current.getBalance(new PublicKey(destAddr)).then(setRxBalance);
            });

        })
        .catch(console.error);

    }


    return (
        <form onSubmit={handleSubmit}>
            <label>Enter address of destination</label><br/>
            <input type="text" value={destAddr} onChange={handleChangeAddr}/><br/>
            <label>Amount of lamports</label><br/>
            <input type="number" value={lamports} onChange={handleChangeLamp}/><br/>
            <input type="submit" value="Send lamports"/>
            <hr/>
            <p>My Balance: {myBalance} lamports</p>
            <p>Recipient Balance: {rxBalance} lamports</p>
            <hr/>
            { txid ? <p>Transaction id: <span style={{fontSize: '0.7em'}}>{txid}</span></p> : null }
            { slot ? <p>Confirmation slot: {slot}</p> : null }
        </form>
    );

}


export default TransferSol;